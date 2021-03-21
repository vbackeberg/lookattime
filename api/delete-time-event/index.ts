import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { sqlConnectionConfig } from "../shared/sql-connection-config";
import { validate as validUuid } from "uuid";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const id = req.query.id;
  const timelineId = req.query.timelineId;
  const userId = req.query.userId;

  if (!validRequest(id, timelineId, userId)) {
    context.res = {
      status: 400,
    };
  } else {
    try {
      await sql.connect(sqlConnectionConfig);

      // TODO: Verify time event is part of specified timeline.
      const result = await sql.query`
      delete from timeEvents
      where id = ${id} and timelineId in (
        select id from timelines where id = ${timelineId} and userId = ${userId}
      );`;

      console.log(result);
    } catch (e) {
      console.warn(e);
      context.res = {
        status: 500,
      };
    }
  }
};
function validRequest(id: string, timelineId: string, userId: string): boolean {
  return validUuid(id) && validUuid(timelineId) && validUuid(userId);
}
export default httpTrigger;
