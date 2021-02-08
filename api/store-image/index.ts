import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validateBufferMIMEType } from "validate-image-type";
import { BlockBlobClient } from "@azure/storage-blob";
import { validate as validUuid, v4 as uuid } from "uuid";
import * as multipart from "parse-multipart";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const imageData = getImageData(req);

  if (!validQueryParameters(req.query) || !validImage(imageData)) {
    context.res = {
      status: 400,
    };
  } else {
    const imageId = req.query.imageId;
    const timeEventId = req.query.timeEventId;
    const timelineId = req.query.timelineId;
    const userId = req.query.userId;

    try {
      const storeImageIdTask = storeImageId(
        imageId,
        timeEventId,
        timelineId,
        userId
      );
      const storeImageTask = storeImage(imageId, imageData);

      await storeImageIdTask; // If blob upload fails, revert imageId query.
      const response = await storeImageTask;

      context.res = {
        status: response._response.status,
      };
    } catch (e) {
      console.warn(e);
    }
  }
};

function getImageData(req: HttpRequest): Buffer {
  return multipart.Parse(
    Buffer.from(req.body),
    multipart.getBoundary(req.headers["content-type"])
  )[0].data;
}
function validImage(imageData: Buffer): boolean {
  const result = validateBufferMIMEType(imageData, {
    allowMimeTypes: ["image/jpeg", "image/gif", "image/png", "image/svg+xml"],
  });

  if (result.error) {
    console.warn(result.error);
  }

  return result.ok && imageData.length < 10000000;
}

function validQueryParameters(query: any): boolean {
  return (
    validUuid(query.imageId) &&
    validUuid(query.timeEventId) &&
    validUuid(query.timelineId) &&
    validUuid(query.userId)
  );
}

async function storeImageId(
  imageId: string,
  timeEventId: string,
  timelineId: string,
  userId: string
) {
  await sql.connect(
    `mssql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}?encrypt=true`
  );

  return await sql.query(
    `if exists ( select * from timeEvents where id = '${timeEventId}' and timelineId in (select id from timelines where id = '${timelineId}' and userId = '${userId}')) insert into images values ('${imageId}', '${timeEventId}');`
  );
}

async function storeImage(imageId: string, imageData: Buffer) {
  const blockBlobClient = new BlockBlobClient(
    process.env.AzureWebJobsStorageLookattime,
    process.env.AzureWebJobsStorageLookattime_ContainerName,
    imageId
  );

  return await blockBlobClient.upload(imageData, imageData.length);
}

export default httpTrigger;
