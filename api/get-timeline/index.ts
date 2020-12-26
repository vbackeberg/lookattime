import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const name = req.query.name || (req.body && req.body.name);

  const response = [
    {
      id: 1,
      title: "Title",
      date: 1510,
      importance: 20,
      text: "Text Text Text Text Text Text Text Text Text Text ",
      imageIds: [4, 2],
    },
    {
      id: 2,
      title: "Event 2",
      date: 1510,
      importance: 20,
      text: "Text Text Text Text Text Text Text Text Text Text ",
      imageIds: [6, 11],
    },
  ];

  const responseMessage = name
    ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    : response;

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};

export default httpTrigger;
