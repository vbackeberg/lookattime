import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validate as validUuid } from "uuid";
import { BlockBlobClient } from "@azure/storage-blob";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const timeEventId = req.query.timeEventId;

  if (!validUuid(timeEventId)) {
    context.res = {
      status: 400,
    };
  } else {
    try {
      await sql.connect(
        `mssql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}?encrypt=true`
      );

      const result = await sql.query(
        `select id from images where timeEventId = '${timeEventId}';`
      );

      const imageIds = (result.recordset as any[]).map((o) => {
        return o.id;
      });

      const downloadTasks = [] as Promise<Buffer>[];

      for (let i = 0; i < imageIds.length; i++) {
        downloadTasks[i] = new BlockBlobClient(
          process.env.AzureWebJobsStorageLookattime,
          process.env.AzureWebJobsStorageLookattime_ContainerName,
          imageIds[i]
        ).downloadToBuffer();
        console.log("downloading " + imageIds[i]);
      }

      const downloads = await Promise.all(downloadTasks);
      console.log("download finished");

      context.res = {
        body: downloads,
      };
    } catch (e) {
      console.warn(e);
    }
  }
};

export default httpTrigger;
