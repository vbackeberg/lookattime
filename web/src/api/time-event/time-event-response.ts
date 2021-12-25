import ImageReferenceModel from "@/models/image-reference-model";

export default class TimeEventResponse {
  id!: string;
  textValue!: string;
  dateValue!: string;
  importanceValue!: number;
  imageReferences!: ImageReferenceModel[];
  title!: string;
}
