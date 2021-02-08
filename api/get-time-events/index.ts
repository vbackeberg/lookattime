import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validate as validUuid } from "uuid";
import ImageDto from "./image-dto";
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
    };
  } else {
    try {
      await sql.connect(
        `mssql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}?encrypt=true`
      );

      const timeEventsResult = await sql.query(
        `select * from timeEvents where timelineId = '${timelineId}';`
      );

      const imagesResult = await sql.query(
        `select * from images where timeEventId in (select id from timeEvents where timelineId = '${timelineId}');`
      );

      const images = imagesResult.recordset as ImageDto[];

      const timeEvents = (timeEventsResult.recordset as TimeEventResponse[]).map(
        (timeEvent) => {
          timeEvent.imageIds = images
            .filter((image) => image.timeEventId === timeEvent.id)
            .map((image) => image.id);

          return timeEvent;
        }
      );

      context.res = {
        body: timeEvents,
      };

      console.log(timeEvents);
    } catch (e) {
      console.log(e);
    }
  }
};

export default httpTrigger;
