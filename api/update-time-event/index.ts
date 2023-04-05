import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobDeleteIfExistsResponse } from "@azure/storage-blob";
import NoTimeEventCreatedOrUpdatedError from "../shared/errors/no-time-event-created-or-updated-error";
import ImageBlobService from "../shared/image-blob-service";
import TimeEventRequest from "../shared/models/api/time-event-request";
import ImageDto from "../shared/models/dtos/image-dto";
import { sqlConnectionConfig } from "../shared/sql-connection-config";
import TimeEventRequestValidator from "../shared/time-event-request-validator";
import sanitize from "sanitize-html";
const sql = require("mssql");

/**
 * Creates or updates a time event.
 *
 * @param context
 * @param req
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const timeEventRequest = req.body as TimeEventRequest;

  if (!TimeEventRequestValidator.isValid(timeEventRequest)) {
    context.res = {
      status: 400,
      body: "invalid request",
    };
  } else {
    try {
      await sql.connect(sqlConnectionConfig);
      await createOrUpdateTimeEvent(timeEventRequest);
      await deleteObsoleteImages(timeEventRequest);

      console.log(
        "Successfully created or updated time event: " + timeEventRequest.id
      );
    } catch (e) {
      console.error(e);
      context.res = {
        status: 500,
      };
    }
  }

  /**
   * Creates or updates a time event.
   *
   * SQL statement:
   * 1. Verifies that time event is
   * actually associated with the given timeline and user.
   *
   * 2. Determines whether time event already exists or has
   * to be created.
   *
   * 3. Updates if exists, inserts if not.
   * @param timeEventRequest
   */
  async function createOrUpdateTimeEvent(timeEventRequest: TimeEventRequest) {
    const textValueSanitized = sanitize(timeEventRequest.textValue, {
      allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
      allowedAttributes: {
        img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
      },
    });

    const result = await sql.query`
      if exists (
        select id from timelines
        where id = ${timeEventRequest.timelineId}
        and userId = ${timeEventRequest.userId}
      )

      begin
        if exists (
          select id from timeEvents
          where id = ${timeEventRequest.id}
        )
        
        begin
          update timeEvents set
            title = ${timeEventRequest.title},
            textValue = ${textValueSanitized},
            dateValue = ${timeEventRequest.dateValue},
            importanceValue = ${timeEventRequest.importanceValue}
          where
            id = ${timeEventRequest.id}
            and timelineId = ${timeEventRequest.timelineId}
        end

        else

        begin
          insert into timeEvents values (
            ${timeEventRequest.id},
            ${timeEventRequest.timelineId},
            ${timeEventRequest.title},
            ${textValueSanitized},
            ${timeEventRequest.dateValue},
            ${timeEventRequest.importanceValue}
          )
        end
      end;`;

    if (result.rowsAffected[0] === 0) {
      throw new NoTimeEventCreatedOrUpdatedError(
        "Did not insert into or updated timeEvents for timeEvent id: " +
          timeEventRequest.id +
          ", timelineId: " +
          timeEventRequest.timelineId +
          ", userId: " +
          timeEventRequest.userId
      );
    }
  }

  async function getImagesToDelete(
    timeEventId: string,
    imageIds: string[]
  ): Promise<ImageDto[]> {
    const result =
      await sql.query`select * from images where timeEventId = ${timeEventId} ;`;

    return (result.recordset as ImageDto[]).filter(
      (image) => !imageIds.includes(image.id)
    );
  }

  /**
   * Retrieves images from text.
   * Determines images that have been removed from the text.
   * Deletes image references.
   * Deletes image blobs.
   *
   * @param timeEventRequest
   */
  async function deleteObsoleteImages(timeEventRequest: TimeEventRequest) {
    const imagesToDelete = await getImagesToDelete(
      timeEventRequest.id,
      retrieveImageIds(timeEventRequest.textValue)
    );

    if (imagesToDelete.length == 0) {
      console.log(`No images to delete`);
    } else {
      console.log(
        `Deleting the following images: ${imagesToDelete.flatMap(
          (image) => image.id
        )}...`
      );
      await deleteImageBlobs(imagesToDelete);
      await deleteImageReferences(imagesToDelete);
    }
  }

  /**
   * Deletes all specified image references.
   *
   * @param imagesToDelete
   */
  async function deleteImageReferences(imagesToDelete: ImageDto[]) {
    const resultDeletedImages = await sql.query`
      delete from images
      where id in (${imagesToDelete.flatMap((image) => image.id)});
    `;

    console.log(
      `Deleted ${resultDeletedImages.rowsAffected[0]} image references`
    );
  }

  /**
   * Deletes all specified image blobs.
   *
   * @param imagesToDelete
   */
  async function deleteImageBlobs(imagesToDelete: ImageDto[]) {
    const deleteImageBlobTasks: Promise<BlobDeleteIfExistsResponse>[] = [];
    imagesToDelete.forEach((image) =>
      deleteImageBlobTasks.push(ImageBlobService.deleteImage(image))
    );

    try {
      await Promise.all(deleteImageBlobTasks);
      console.log(
        `Deleted the following image blobs: ${imagesToDelete.flatMap(
          (image) => image.id
        )}`
      );
    } catch (e) {
      console.error("Deleting image blobs failed: ", e);
    }
  }

  /**
   * Extracts all image ids (for deleting unused image blobs) from the time event text.
   *
   * For one image in the text, `matchAll(regex)` will return an array like the following.
   * The match at index 1 represents the id.
   *
   * 0: `<img src=\"https://lookattime2.blob.core.windows.net/lookattime2/01853899-20f4-41a0-bb4c-a02763982b3c.jpeg\">`
   *
   * 1: `01853899-20f4-41a0-bb4c-a02763982b3c`
   *
   * 2: `jpeg`
   *
   * @param textValue
   *
   * @returns image ids
   */
  function retrieveImageIds(textValue: string) {
    return Array.from(
      textValue.matchAll(
        /<img src="https:\/\/lookattime2\.blob\.core\.windows\.net\/lookattime2\/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\.(jpeg|gif|png|svg)">/gm
      )
    ).map((match) => match[1]);
  }
};
export default httpTrigger;
