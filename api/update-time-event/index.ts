import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  BlobDeleteIfExistsResponse,
  BlockBlobUploadResponse,
} from "@azure/storage-blob";
import { TYPES } from "mssql";
import { validate as validUuid } from "uuid";
import ImageDto from "../shared/models/dtos/image-dto";
import NoImageBlobStoredError from "../shared/errors/no-image-blob-stored-error";
import NoImageIdUpdatedError from "../shared/errors/no-image-id-updated-error";
import FormDataParser from "../shared/form-data-parser";
import ImageBlobService from "../shared/image-blob-service";
import ImageValidator from "../shared/image-validator";
import ImageRequest from "../shared/models/api/image-request";
import TimeEventRequest from "../shared/models/api/time-event-request";
import { sqlConnectionConfig } from "../shared/sql-connection-config";
import NoTimeEventUpdatedError from "../shared/errors/no-time-event-updated-error";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  let formDataParts;
  try {
    formDataParts = FormDataParser.getFormDataParts(req);
  } catch (e) {
    console.warn(e);
    context.res = {
      status: 400,
    };
  }

  const timeEvent = JSON.parse(
    formDataParts[0].data.toString()
  ) as TimeEventRequest;
  const timelineId = formDataParts[1].data.toString();
  const userId = formDataParts[2].data.toString();

  let images: ImageRequest[] = [];
  for (let i = 3; i < formDataParts.length; i++) {
    images.push(formDataParts[i]);
  }

  if (!validRequest(timeEvent, timelineId, userId, images)) {
    context.res = {
      status: 400,
    };
  } else {
    try {
      let storeImageBlobTasks: Promise<BlockBlobUploadResponse>[] = [];
      images.forEach((image) =>
        storeImageBlobTasks.push(ImageBlobService.uploadImage(image))
      );

      await sql.connect(sqlConnectionConfig);
      deleteImageBlobs(timeEvent);
      await updateTimeEvent(timeEvent, timelineId, userId);
      await updateImages(timeEvent, timelineId, userId);
      await Promise.all(storeImageBlobTasks);

      console.log("Successfully updated time event: " + timeEvent.id);
    } catch (e) {
      console.error(e);

      if (e instanceof NoImageBlobStoredError) {
        console.warn(
          "Storing image blob failed. Revert storing images for timeEvent: ",
          timeEvent.id
        );
        await deleteImages(timeEvent.id);
      }

      context.res = {
        status: 500,
      };
    }
  }

  function validRequest(
    timeEvent: TimeEventRequest,
    timelineId: string,
    userId: string,
    images: ImageRequest[]
  ): boolean {
    return (
      validUuid(timeEvent.id) &&
      validUuid(timelineId) &&
      validUuid(userId) &&
      !isNaN(timeEvent.dateValue) &&
      !isNaN(timeEvent.importanceValue) &&
      images.every((image) => ImageValidator.validImage(image))
    );
  }

  async function updateTimeEvent(
    timeEvent: TimeEventRequest,
    timelineId: string,
    userId: string
  ) {
    const result = await sql.query`
      if exists (
        select * from timelines where id = ${timelineId} and userId = ${userId}
      ) update timeEvents set
        title = ${timeEvent.title},
        textValue = ${timeEvent.textValue},
        dateValue = ${timeEvent.dateValue},
        importanceValue = ${timeEvent.importanceValue}
      where
        id = ${timeEvent.id}
        and timelineId = ${timelineId};`;

    if (result.rowsAffected[0] === 0) {
      throw new NoTimeEventUpdatedError(
        "Did not insert into timeEvents for timeEvent id: " +
          timeEvent.id +
          ", timelineId: " +
          timelineId +
          ", userId: " +
          userId
      );
    }
  }

  /**
   * Delete all images and add all remaining images back.
   * 
   * @param timeEvent 
   * @param timelineId 
   * @param userId 
   */
  async function updateImages(
    timeEvent: TimeEventRequest,
    timelineId: string,
    userId: string
  ) {
    const resultDeleteAllImages = await sql.query`
      delete from images
      where timeEventId = ${timeEvent.id}
      and timeEventId in (
        select id from timeEvents where timelineId = ${timelineId}
        and timelineId in (


          select id from timelines where id = ${timelineId} and userId = ${userId}
        )
      );`;
    console.log(resultDeleteAllImages);

    if (timeEvent.imageReferences.length > 0) {
      const table = new sql.Table("images");
      table.columns.add("id", TYPES.UniqueIdentifier, { nullable: false });
      table.columns.add("timeEventId", TYPES.UniqueIdentifier, {
        nullable: false,
      });
      table.columns.add("extension", TYPES.NVarChar(255), { nullable: false });

      timeEvent.imageReferences.forEach((imageReference) =>
        table.rows.add(
          imageReference.id,
          timeEvent.id,
          imageReference.extension
        )
      );

      const resultInsertImages = await new sql.Request().bulk(table);

      if (resultInsertImages.rowsAffected[0] === 0) {
        throw new NoImageIdUpdatedError(
          "Did not insert into images for timeEventId: " +
            timeEvent.id +
            ", timelineId: " +
            timelineId +
            ", userId: " +
            userId
        );
      }
    }
  }

  async function deleteImageBlobs(timeEvent: TimeEventRequest) {
    const result = await sql.query`
      select * from images where timeEventId = ${timeEvent.id}
      ;`;

    const imagesToDelete = (result.recordset as ImageDto[]).filter((image) =>
      timeEvent.imageReferences.every(
        (imageReference) => imageReference.id !== image.id
      )
    );

    const deleteImageBlobTasks: Promise<BlobDeleteIfExistsResponse>[] = [];
    imagesToDelete.forEach((image) =>
      deleteImageBlobTasks.push(ImageBlobService.deleteImage(image))
    );

    try {
      await Promise.all(deleteImageBlobTasks);
    } catch (e) {
      console.error("Deleting image blobs failed: ", e);
    }
  }

  async function deleteImages(timeEventId: string): Promise<void> {
    await sql.connect(sqlConnectionConfig);

    const result =
      await sql.query`delete from images where timeEventId = ${timeEventId});`;
    console.warn("Number of images deleted: ", result.rowsAffected[0]);
  }
};
export default httpTrigger;
