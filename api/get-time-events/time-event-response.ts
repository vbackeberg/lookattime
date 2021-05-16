import ImageReferenceResponse from "../shared/models/api/image-reference-request-response";

export default class TimeEventResponse {
  id!: string;
  textValue!: string;
  dateValue!: number;
  importanceValue!: number;
  imageReferences!: ImageReferenceResponse[];
  title!: string;
}
