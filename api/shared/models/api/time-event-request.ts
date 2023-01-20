import ImageReferenceRequestResponse from "./image-reference-request-response";

export default class TimeEventRequest {
  id!: string;
  title!: string;
  textValue!: string;
  dateValue!: number;
  importanceValue!: number;
  imageIds!: string[];
  timelineId!: string;
  userId!: string;
}
