import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validateBufferMIMEType } from "validate-image-type";
import { BlockBlobClient } from "@azure/storage-blob";
import { validate as validUuid } from "uuid";
import * as multipart from "parse-multipart";
import { getExtension } from "mime";
import ImageRequest from "./image-request";
import { sqlConnectionConfig }from "../shared/sql-connection-config";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const image = getImageData(req) as ImageRequest;

  if (!validQueryParameters(req.query) || !(await validImage(image.data))) {
    context.res = {
      status: 400,
    };
  } else {
    const imageId = req.query.imageId;
    const timeEventId = req.query.timeEventId;
    const timelineId = req.query.timelineId;
    const userId = req.query.userId;
    const imageExtension = getExtension(image.type);

    try {
      const storeImageIdTask = storeImageId(
        imageId,
        imageExtension,
        timeEventId,
        timelineId,
        userId
      );

      const storeImageBlobTask = storeImageBlob(
        imageId + "." + imageExtension,
        image.data
      );

      const storeImageIdResponse = await storeImageIdTask; // TODO If blob upload fails, revert imageId query.
      const storeImageBlobResponse = await storeImageBlobTask;

      context.res = {
        status: storeImageBlobResponse._response.status,
      };
    } catch (e) {
      console.warn(e);
    }
  }
};

function getImageData(req: HttpRequest) {
  return multipart.Parse(
    Buffer.from(req.body),
    multipart.getBoundary(req.headers["content-type"])
  )[0];
}
async function validImage(imageData: Buffer): Promise<boolean> {
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
  imageExtension: string,
  timeEventId: string,
  timelineId: string,
  userId: string
) {
  await sql.connect(sqlConnectionConfig);

  return sql.query(
    `if exists ( select * from timeEvents where id = '${timeEventId}' and timelineId in (select id from timelines where id = '${timelineId}' and userId = '${userId}')) insert into images values ('${imageId}', '${timeEventId}', '${imageExtension}');`
  );
}

async function storeImageBlob(blobName: string, imageData: Buffer): Promise<BlockBlobUploadResponse> {
  const blockBlobClient = new BlockBlobClient(
    process.env.AzureWebJobsStorageLookattime,
    process.env.AzureWebJobsStorageLookattime_ContainerName,
    blobName
  );

  return blockBlobClient.upload(imageData, imageData.byteLength);
}

export default httpTrigger;
