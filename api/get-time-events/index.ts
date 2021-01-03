import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validate as validUuid } from "uuid";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const timelineId = req.query.timelineId || (req.body && req.body.timelineId);

  if (!validUuid(timelineId)) {
    context.res = {
      status: 400,
    };
  } else {
    try {
      await sql.connect(
        `mssql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}?encrypt=true`
      );

      const result = await sql.query(
        `select * from timeEvents where timelineId = '${timelineId}';`
      );

      context.res = {
        body: result.recordset,
      };

      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
};

export default httpTrigger;
