import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validate as validUuid } from "uuid";
import { sqlConnectionConfig } from "../shared/sql-connection-config";
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
      await sql.connect(sqlConnectionConfig);

      //TODO turn this query into a join and check if exists
      const result = await sql.query(
        `if exists ( select * from timelines where id = '${timeEventRequest.timelineId}' and userId = '${timeEventRequest.userId}') insert into timeEvents values ('${timeEventRequest.id}', '${timeEventRequest.timelineId}', '${timeEventRequest.title}', '${timeEventRequest.textValue}', ${timeEventRequest.dateValue}, ${timeEventRequest.importanceValue});`
      );

      console.log(result);
    } catch (e) {
      console.warn(e);
      context.res = {
        status: 500,
      };
    }
  }
};

function validRequest(timeEventRequest: TimeEventRequest): boolean {
  return (
    validUuid(timeEventRequest.id) &&
    validUuid(timeEventRequest.timelineId) &&
    validUuid(timeEventRequest.userId) &&
    !isNaN(timeEventRequest.dateValue) &&
    !isNaN(timeEventRequest.importanceValue)
  );
}

export default httpTrigger;
