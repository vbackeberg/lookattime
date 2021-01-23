import UserModel from "@/models/user-model";
import UserApiModel from "./user-api-model";

export default class UserApiMapper {
  public static toApi(user: UserModel): UserApiModel {
    return { id: user.id, nameValue: user.name } as UserApiModel;
  }

  public static toModel(user: UserApiModel): UserModel {
    return new UserModel(user.id, user.nameValue);
  }
}
