import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validate as validUuid } from "uuid";
import TimeEventRequest from "./time-event-request";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const timeEventRequest = req.body as TimeEventRequest;

  if (!validRequest(timeEventRequest)) {
    context.res = {
      status: 400,
    };
  } else {
    try {
      await sql.connect(
        `mssql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}?encrypt=true`
      );

      const result = await sql.query(
        `insert into timeEvents values ('${timeEventRequest.id}', '${timeEventRequest.timelineId}', '${timeEventRequest.title}', '${timeEventRequest.textValue}', ${timeEventRequest.dateValue}, ${timeEventRequest.importanceValue});`
      );

      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
};

function validRequest(timeEventRequest: TimeEventRequest) {
  if (!validUuid(timeEventRequest.id)) return false;
  if (!validUuid(timeEventRequest.timelineId)) return false;
  if (isNaN(timeEventRequest.dateValue)) return false;
  if (isNaN(timeEventRequest.importanceValue)) return false;
  return true;
}

export default httpTrigger;
