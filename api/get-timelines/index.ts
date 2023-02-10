import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { sqlConnectionConfig } from "../shared/sql-connection-config";
import { validate as validUuid } from "uuid";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const userId = req.query.userId;

  if (!validUuid(userId)) {
    context.res = {
      status: 400,
    };
  } else {
    try {
      await sql.connect(sqlConnectionConfig);

      const result =
        await sql.query`select * from timelines where userId = ${userId};`;

      context.res = {
        body: result.recordset,
      };

      console.log("Successfully retrieved timelines for user: " + userId);
    } catch (e) {
      console.warn(e);
      context.res = {
        status: 500,
      };
    }
  }
};

export default httpTrigger;
