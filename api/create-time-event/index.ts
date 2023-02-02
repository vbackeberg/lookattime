import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { sqlConnectionConfig } from "../shared/sql-connection-config";
import TimeEventRequest from "../shared/models/api/time-event-request";
import NoTimeEventCreatedError from "../shared/errors/no-time-event-created-error";
import TimeEventRequestValidator from "../shared/time-event-request-validator";
const sql = require("mssql");

// TODO: Consider unifying with update TE and delete this.

/**
 * Creates a time event.
 *
 * @param context
 * @param req
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const timeEventRequest = req.body as TimeEventRequest;

  if (!TimeEventRequestValidator.isValid(timeEventRequest)) {
    context.res = {
      status: 400,
    };
  } else {
    try {
      await sql.connect(sqlConnectionConfig);
      await createTimeEvent(timeEventRequest);

      console.log("Successfully created time event: " + timeEventRequest.id);
    } catch (e) {
      console.error(e);

      context.res = {
        status: 500,
      };
    }
  }

  async function createTimeEvent(timeEventRequest: TimeEventRequest) {
    const result = await sql.query`
      if exists (
        select * from timelines
        where id = ${timeEventRequest.timelineId}
        and userId = ${timeEventRequest.userId}
      ) insert into timeEvents values (
        ${timeEventRequest.id}, ${timeEventRequest.timelineId}, ${timeEventRequest.title}, ${timeEventRequest.textValue}, ${timeEventRequest.dateValue}, ${timeEventRequest.importanceValue}
      );`;

    if (result.rowsAffected[0] === 0) {
      throw new NoTimeEventCreatedError(
        "Did not insert into timeEvents for timeEvent id: " +
          timeEventRequest.id +
          ", timelineId: " +
          timeEventRequest.timelineId +
          ", userId: " +
          timeEventRequest.userId
      );
    }
  }
};
export default httpTrigger;
