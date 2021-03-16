import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validate as validUuid } from "uuid";
import { sqlConnectionConfig } from "../shared/sql-connection-config";
import UserRequest from "./user-request";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const userRequest = req.body as UserRequest;

  if (!validUuid(userRequest.id)) {
    context.res = {
      status: 400,
    };
  } else {
    try {
      await sql.connect(sqlConnectionConfig);

      const result = await sql.query`insert into users values ('${userRequest.id}', '${userRequest.nameValue}');`;

      console.log(result);
    } catch (e) {
      console.warn(e);
      context.res = {
        status: 500,
      };
    }
  }
};

export default httpTrigger;
