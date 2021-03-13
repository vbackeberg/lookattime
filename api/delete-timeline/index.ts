import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { sqlConnectionConfig }from "../shared/sql-connection-config";
import { validate as validUuid } from "uuid";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const id = req.query.id;
  const userId = req.query.userId;

  if (!validRequest(id, userId)) {
    context.res = {
      status: 400,
    };
  } else {
    try {
      await sql.connect(
        sqlConnectionConfig
      );

      const result = await sql.query(
        `delete from timelines where id = '${id}' and userId = '${userId}';`
      );

      console.log(result);
    } catch (e) {
      console.warn(e);
      context.res = {
        status: 500,
      }; ;
    }
  }
};

function validRequest(id: string, userId: string): boolean {
  return validUuid(id) && validUuid(userId);
}

export default httpTrigger;
