import UserModel from "@/models/user-model";
import UserRequest from "./user-request";

export default class UserRequestMapper {
  public static map(user: UserModel): UserRequest {
    return { id: user.id, nameValue: user.name } as UserRequest;
  }
}
