import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Connection, Request } from "tedious";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const name = req.query.name || (req.body && req.body.name);

  const config = {
    authentication: {
      options: {
        userName: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
      },
      type: "default",
    },
    server: process.env.DB_SERVER,
    options: {
      database: process.env.DB_DATABASE,
      encrypt: true,
      validateBulkLoadParameters: true,
    },
  };

  const connection = new Connection(config);
  connection.connect();

  connection.on("connect", function (err) {
    if (err) {
      console.log("Error: ", err);
    }
    console.log("connected");

    executeQuery(connection);
  });

  const responseMessage = name
    ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    : "response";

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};

function executeQuery(connection) {
  const request = new Request("SELECT * from timelines", function (err) {
    if (err) {
      console.log(err);
    }
  });

  let result = "";
  request.on("row", function (columns) {
    columns.forEach(function (column) {
      if (column.value === null) {
        console.log("NULL");
      } else {
        result += column.value + " ";
      }
    });
    console.log(result);
    result = "";
  });

  request.on("done", function (rowCount, more) {
    console.log(rowCount + " rows returned");
  });
  connection.execSql(request);
}

export default httpTrigger;
