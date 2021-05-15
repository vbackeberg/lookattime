import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlockBlobClient, BlockBlobUploadResponse } from "@azure/storage-blob";
import { validate as validUuid } from "uuid";
import { sqlConnectionConfig } from "../shared/sql-connection-config";
import TimeEventRequest from "../shared/models/time-event-request";
import ImageRequest from "../shared/models/image-request";
import NoImageBlobStoredError from "../shared/errors/no-image-blob-stored-error";
import NoTimeEventCreatedError from "../shared/errors/no-time-event-created-error";
import NoImageIdStoredError from "../shared/errors/no-image-id-stored-error";
import { TYPES } from "mssql";
import ImageValidator from "../shared/image-validator";
import FormDataParser from "../shared/form-data-parser";
import ImageBlobService from "../shared/image-blob-service";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  let formDataParts: any;
  try {
    formDataParts = FormDataParser.getFormDataParts(req);
  } catch (e) {
    console.warn(e);
    context.res = {
      status: 400,
    };
  }

  const timeEvent = JSON.parse(
    formDataParts[0].data.toString()
  ) as TimeEventRequest;
  const timelineId = formDataParts[1].data.toString();
  const userId = formDataParts[2].data.toString();

  let images: ImageRequest[] = [];
  for (let i = 3; i < formDataParts.length; i++) {
    images.push(formDataParts[i]);
  }

  if (!validRequest(timeEvent, timelineId, userId, images)) {
    context.res = {
      status: 400,
    };
  } else {
    try {
      let storeImageBlobTasks: Promise<BlockBlobUploadResponse>[] = [];
      images.forEach((image) =>
        storeImageBlobTasks.push(ImageBlobService.uploadImage(image))
      );

      await sql.connect(sqlConnectionConfig);
      await createTimeEvent(timeEvent, timelineId, userId);
      await createImages(timeEvent, timelineId, userId);
      await Promise.all(storeImageBlobTasks);

      console.log("Successfully created time event: " + timeEvent.id);
    } catch (e) {
      console.error(e);

      if (e instanceof NoImageBlobStoredError) {
        console.warn(
          "Storing image blob failed. Revert storing images for timeEvent: ",
          timeEvent.id
        );
        await deleteImages(timeEvent.id);
      }

      context.res = {
        status: 500,
      };
    }
  }

  function validRequest(
    timeEvent: TimeEventRequest,
    timelineId: string,
    userId: string,
    images: ImageRequest[]
  ): boolean {
    return (
      validUuid(timeEvent.id) &&
      validUuid(timelineId) &&
      validUuid(userId) &&
      !isNaN(timeEvent.dateValue) &&
      !isNaN(timeEvent.importanceValue) &&
      images.every((image) => ImageValidator.validImage(image))
    );
  }

  async function createTimeEvent(
    timeEvent: TimeEventRequest,
    timelineId: string,
    userId: string
  ) {
    //TODO turn this query into a join and check if exists
    const result = await sql.query`
      if exists (
        select * from timelines
        where id = ${timelineId} and userId = ${userId}
      ) insert into timeEvents values (
        ${timeEvent.id}, ${timelineId}, ${timeEvent.title}, ${timeEvent.textValue}, ${timeEvent.dateValue}, ${timeEvent.importanceValue}
      );`;

    if (result.rowsAffected[0] === 0) {
      throw new NoTimeEventCreatedError(
        "Did not insert into timeEvents for timeEvent id: " +
          timeEvent.id +
          ", timelineId: " +
          timelineId +
          ", userId: " +
          userId
      );
    }
  }

  async function createImages(
    timeEvent: TimeEventRequest,
    timelineId: string,
    userId: string
  ) {
    if (timeEvent.imageReferences.length > 0) {
      // We assume that timeEvent timelineId and userId combination is valid.
      const table = new sql.Table("images");
      table.columns.add("id", TYPES.UniqueIdentifier, { nullable: false });
      table.columns.add("timeEventId", TYPES.UniqueIdentifier, {
        nullable: false,
      });
      table.columns.add("extension", TYPES.NVarChar(255), { nullable: false });

      timeEvent.imageReferences.forEach((imageReference) =>
        table.rows.add(
          imageReference.id,
          timeEvent.id,
          imageReference.extension
        )
      );

      const result = await new sql.Request().bulk(table);

      if (result.rowsAffected[0] === 0) {
        throw new NoImageIdStoredError(
          "Did not insert into images for timeEventId: " +
            timeEvent.id +
            ", timelineId: " +
            timelineId +
            ", userId: " +
            userId
        );
      }
    }
  }

  async function deleteImages(timeEventId: string): Promise<void> {
    await sql.connect(sqlConnectionConfig);

    const result =
      await sql.query`delete from images where timeEventId = ${timeEventId});`;
    console.warn("Number of images deleted: ", result.rowsAffected[0]);
  }
};
export default httpTrigger;
