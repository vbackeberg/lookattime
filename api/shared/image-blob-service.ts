import {
  BlobDeleteIfExistsResponse,
  BlockBlobClient,
  BlockBlobUploadResponse,
} from "@azure/storage-blob";
import NoImageBlobStoredError from "./errors/no-image-blob-stored-error";
import ImageDto from "./models/dtos/image-dto";
import ImageRequest from "./models/image-request";

export default class ImageBlobService {
  public static async uploadImage(
    image: ImageRequest
  ): Promise<BlockBlobUploadResponse> {
    const blockBlobClient = new BlockBlobClient(
      process.env.AzureWebJobsStorageLookattime,
      process.env.AzureWebJobsStorageLookattime_ContainerName,
      image.filename
    );

    try {
      return blockBlobClient.upload(image.data, image.data.byteLength);
    } catch (e) {
      throw new NoImageBlobStoredError(e.message); // TODO Consider removing this error and just let error bubble up.
    }
  }

  public static async deleteImage(
    imageDto: ImageDto
  ): Promise<BlobDeleteIfExistsResponse> {
    const blockBlobClient = new BlockBlobClient(
      process.env.AzureWebJobsStorageLookattime,
      process.env.AzureWebJobsStorageLookattime_ContainerName,
      imageDto.id + "." + imageDto.extension
    );

    return blockBlobClient.deleteIfExists({ deleteSnapshots: "include" });
  }
}
