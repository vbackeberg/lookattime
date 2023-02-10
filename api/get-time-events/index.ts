import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validate as validUuid } from "uuid";
import ImageDto from "../shared/models/dtos/image-dto";
import { sqlConnectionConfig } from "../shared/sql-connection-config";
import TimeEventResponse from "./time-event-response";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const timelineId = req.query.timelineId;

  if (!validUuid(timelineId)) {
    context.res = {
      status: 400,
      body: "invalid request",
    };
  } else {
    try {
      await sql.connect(sqlConnectionConfig);

      const result =
        await sql.query`select * from timeEvents where timelineId = ${timelineId};`;

      context.res = {
        body: result.recordset,
      };

      console.log(
        "Successfully retrieved time events for timeline " + timelineId
      );
    } catch (e) {
      console.warn(e);
      context.res = {
        status: 500,
      };
    }
  }
};

export default httpTrigger;
