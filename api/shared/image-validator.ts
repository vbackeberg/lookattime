import { validateBufferMIMEType } from "validate-image-type";
import ValidationError from "./errors/validation-error";
import ImageRequest from "./models/api/image-request";
export default class ImageValidator {

  public static isValid(image: ImageRequest): boolean {
    if (!image.type) {
      throw new ValidationError(
        "Image " + image.filename + " has no type specified."
      );
    }

    if (image.data.length > 10000000) {
      throw new ValidationError(
        "Image " + image.filename + " is too large. Bytes: " + image.data.length
      );
    }

    const result = validateBufferMIMEType(image.data, {
      allowMimeTypes: ["image/jpeg", "image/gif", "image/png", "image/svg+xml"],
    });

    if (result.error) {
      throw new ValidationError(
        "Image " +
          image.filename +
          " is invalid. Error: " +
          result.error.name +
          " Message: " +
          result.error.message
      );
    }

    return result.ok; // TODO boolean return type does not match throws pattern
  }
}
