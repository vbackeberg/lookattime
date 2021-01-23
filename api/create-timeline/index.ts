import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validate as validUuid } from "uuid";
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
      await sql.connect(
        `mssql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}?encrypt=true`
      );

      const result = await sql.query(
        `insert into timelines values ('${timelineRequest.id}', '${timelineRequest.userId}', '${timelineRequest.title}');`
      );
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
};

function validRequest(timelineRequest: TimelineRequest) {
  if (!validUuid(timelineRequest.id)) return false;
  if (!validUuid(timelineRequest.userId)) return false;
}

export default httpTrigger;
