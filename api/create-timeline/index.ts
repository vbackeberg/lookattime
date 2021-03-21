import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validate as validUuid } from "uuid";
import { sqlConnectionConfig } from "../shared/sql-connection-config";
import TimelineRequest from "./timeline-request";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const timelineRequest = req.body as TimelineRequest;

  if (!validRequest(timelineRequest)) {
    context.res = {
      status: 400,
    };
  } else {
    try {
      await sql.connect(sqlConnectionConfig);

      const result = await sql.query`insert into timelines values (${timelineRequest.id}, ${timelineRequest.userId}, ${timelineRequest.title});`;

      console.log(result);
    } catch (e) {
      console.warn(e);
      context.res = {
        status: 500,
      };
    }
  }
};

function validRequest(timelineRequest: TimelineRequest): boolean {
  return validUuid(timelineRequest.id) && validUuid(timelineRequest.userId);
}

export default httpTrigger;
