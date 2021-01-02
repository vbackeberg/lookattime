import { AzureFunction, Context, HttpRequest } from "@azure/functions";
const sql = require("mssql");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const userId = parseInt(req.query.userId || (req.body && req.body.userId));

  try {
    await sql.connect(
      `mssql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}?encrypt=true`
    );

    const result = await sql.query(
      `select * from timelines where userId = ${userId}`
    );

    context.res = {
      body: result.recordset,
    };

    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

export default httpTrigger;
