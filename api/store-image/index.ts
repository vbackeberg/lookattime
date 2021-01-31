import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validateBufferMIMEType } from "validate-image-type";
import { BlockBlobClient } from "@azure/storage-blob";
import { v4 as uuid } from "uuid";
import * as multipart from "parse-multipart";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const imageData = multipart.Parse(
    Buffer.from(req.body),
    multipart.getBoundary(req.headers["content-type"])
  )[0].data as Buffer;

  if (!validImage(imageData)) {
    context.res = {
      status: 400,
    };
  } else {
    const imageId = uuid();

    const blockBlobClient = new BlockBlobClient(
      process.env.AzureWebJobsStorageLookattime,
      process.env.AzureWebJobsStorageLookattime_ContainerName,
      imageId
    );

    const response = await blockBlobClient.upload(imageData, imageData.length);

    context.res = {
      body: { imageId: imageId },
      status: response._response.status,
    };
  }
};
function validImage(imageData: Buffer): boolean {
  const result = validateBufferMIMEType(imageData, {
    allowMimeTypes: ["image/jpeg", "image/gif", "image/png", "image/svg+xml"],
  });

  if (result.error) {
    console.warn(result.error);
  }

  return result.ok;
}

export default httpTrigger;
