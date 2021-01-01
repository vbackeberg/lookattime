import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Connection, Request, TYPES } from "tedious";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const id = parseInt(req.query.id || (req.body && req.body.id));

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

  let response = "";
  connection.on("connect", function (err) {
    if (err) {
      console.log("Error: ", err);
    }
    console.log("connected");

    response = executeQuery(connection, id);
  });

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: response,
  };
};

function executeQuery(connection: Connection, id: number): string {
  const request = new Request(
    "SELECT * from timelines where id = @id",
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  request.addParameter("id", TYPES.Int, id);

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
  });

  request.on("done", function (rowCount, _) {
    console.log(rowCount + " rows returned");
  });
  connection.execSql(request);

  return result;
}

export default httpTrigger;
