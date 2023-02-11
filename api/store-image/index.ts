import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getExtension } from "mime";
import { validate as validUuid } from "uuid";
import NoImageBlobStoredError from "../shared/errors/no-image-blob-stored-error";
import NoImageIdCreatedError from "../shared/errors/no-image-id-created-error";
import FormDataParser from "../shared/form-data-parser";
import ImageBlobService from "../shared/image-blob-service";
import ImageValidator from "../shared/image-validator";
import ImageRequest from "../shared/models/api/image-request";
import { sqlConnectionConfig } from "../shared/sql-connection-config";
const sql = require("mssql");

/** Store image */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  let imageData: ImageRequest;
  try {
    imageData = FormDataParser.getFormDataParts(req)[0];
  } catch (e) {
    console.warn(e);
    context.res = {
      status: 400,
      body: { error: { message: "The image is invalid." } },
    };
  }

  if (!validQueryParameters(req.query) || !ImageValidator.isValid(imageData)) {
    context.res = {
      status: 400,
      body: { error: { message: "The image is invalid." } },
    };
  } else {
    const imageId = req.query.imageId;
    const timeEventId = req.query.timeEventId;
    const timelineId = req.query.timelineId;
    const userId = req.query.userId;
    const imageExtension = getExtension(imageData.type);

    try {
      const storeImageBlobTask = ImageBlobService.uploadImage(
        imageData,
        imageId,
        imageExtension
      );

      await createImage(
        imageId,
        imageExtension,
        timeEventId,
        timelineId,
        userId
      );

      const storeImageBlobResponse = await storeImageBlobTask;

      context.res = {
        status: storeImageBlobResponse._response.status,
        body: JSON.stringify({
          url: `${process.env.IMAGE_STORAGE_URL}/${imageId}.${imageExtension}`, // TODO add on web
        }),
      };
    } catch (e) {
      console.warn(e);

      if (e instanceof NoImageBlobStoredError) {
        console.warn(
          "Storing image blob failed. Revert storing imageId: " + imageId
        );
        await deleteImage(imageId);
      }

      // TODO: if sql failed delete blobs.

      context.res = {
        status: 500,
        body: {
          error: {
            message: "Sorry, something went wrong storing the image.",
          },
        },
      };
    }
  }
};

function validQueryParameters(query: any): boolean {
  return (
    validUuid(query.imageId) &&
    validUuid(query.timeEventId) &&
    validUuid(query.timelineId) &&
    validUuid(query.userId)
  );
}

async function createImage(
  imageId: string,
  imageExtension: string,
  timeEventId: string,
  timelineId: string,
  userId: string
) {
  await sql.connect(sqlConnectionConfig);

  const result = await sql.query`
  if exists (
    select * from timeEvents
    where id = ${timeEventId} and timelineId in (
      select id from timelines
        where id = ${timelineId} and userId = ${userId}
    )
  ) insert into images values (
    ${imageId}, ${timeEventId}, ${imageExtension}
  );`;

  if (result.rowsAffected[0] === 0) {
    throw new NoImageIdCreatedError(
      "Did not insert into images for imageId: " +
        imageId +
        ", timeEventId: " +
        timeEventId +
        ", timelineId: " +
        timelineId +
        ", userId: " +
        userId
    );
  }
}

async function deleteImage(id: string) {
  return sql.query`delete from images where id = ${id});`;
}

export default httpTrigger;
