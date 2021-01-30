export default class ImageRequestMapper {
  public static map(image: File): FormData {
    const formData = new FormData();

    formData.append("image", image);

    return formData;
  }
}
