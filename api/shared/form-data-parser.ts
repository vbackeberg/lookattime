import { HttpRequest } from "@azure/functions";
import * as parseMultipart from "parse-multipart";
export default class FormDataParser {
  public static getFormDataParts(req: HttpRequest): any {
    return parseMultipart.Parse(
      Buffer.from(req.body),
      parseMultipart.getBoundary(req.headers["content-type"])
    );
  }
}
