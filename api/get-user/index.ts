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

  if (!validUuid(id)) {
    context.res = {
      status: 400,
    };
  } else {
    try {
      // TODO: Increase timeout here
      await sql.connect(sqlConnectionConfig);

      const result = await sql.query`select * from users where id = ${id};`;
      console.log("Successfully retrieved user: " + id);

      if (!result.recordset[0]) {
        context.res = {
          status: 404,
        };
      } else {
        context.res = {
          body: result.recordset[0],
        };
      }
    } catch (e) {
      console.warn(e);
      context.res = {
        status: 500,
      };
    }
  }
};

export default httpTrigger;
