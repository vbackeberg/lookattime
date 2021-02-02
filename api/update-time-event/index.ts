import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validate as validUuid } from "uuid";
import TimeEventRequest from "../shared/time-event-request";
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
        `update timeEvents set timelineId = '${timeEventRequest.timelineId}', title = '${timeEventRequest.title}', textValue = '${timeEventRequest.textValue}', dateValue = ${timeEventRequest.dateValue}, importanceValue = ${timeEventRequest.importanceValue} where id = '${timeEventRequest.id}';`
      );

      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
};

function validRequest(timeEventRequest: TimeEventRequest): boolean {
  return (
    validUuid(timeEventRequest.id) &&
    validUuid(timeEventRequest.timelineId) &&
    !isNaN(timeEventRequest.dateValue) &&
    !isNaN(timeEventRequest.importanceValue)
  );
}

export default httpTrigger;
