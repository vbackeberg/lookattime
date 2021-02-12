import ImageReferenceModel from "./image-reference-model";

export default class TimeEventResponse {
  id!: string;
  textValue!: string;
  dateValue!: number;
  importanceValue!: number;
  imageReferences!: ImageReferenceModel[];
  title!: string;
}
