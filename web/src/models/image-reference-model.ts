export default class ImageReferenceModel {
  id: string;
  extension: string;

  constructor(id: string, extension: string) {
    this.id = id;
    this.extension = extension;
  }
}
