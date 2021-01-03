import axios from "axios";
import { v4 as uuid, validate as validUuid } from "uuid";

export default class UserService {
  public static getUserId(): string {
    if (this.hasUserId()) {
      return window.localStorage.getItem("userId") as string;
    } else {
      throw new Error("No user id in local storage.");
    }
  }

  public static hasUserId(): boolean {
    const userId = window.localStorage.getItem("userId");

    if (!userId || !validUuid(userId)) return false;
    return true;
  }

  public static async createUserId() {
    const userId = uuid();

    window.localStorage.setItem("userId", userId);

    const response = await axios.post("http://localhost:7071/api/create-user", {
      id: this.getUserId(),
      nameValue: "User Name"
    });

    if (
      !response.status.toString().startsWith("2") &&
      !response.status.toString().startsWith("3")
    ) {
      throw new Error("Server responded with an error.");
    }
  }

  public static async deleteUserId() {
    const response = await axios.delete(
      "http://localhost:7071/api/delete-user?id=" + this.getUserId()
    );

    if (!response.status.toString().startsWith("2")) {
      throw new Error("Server did not respond with status 2xx.");
    }

    window.localStorage.removeItem("userId");

    if (this.hasUserId()) {
      throw new Error("User id could not be deleted from local storage.");
    }
  }
}
