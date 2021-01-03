import axios from "axios";
import { v4 as uuid, validate as validUuid } from "uuid";

export default class UserService {
  public static getUserId(): string {
    if (this.hasUserId()) {
      return window.localStorage.getItem("userId") as string;
    } else {
      throw new Error("No user id found.");
    }
  }

  public static hasUserId(): boolean {
    const userId = window.localStorage.getItem("userId");

    if (!userId || !validUuid(userId)) return false;
    return true;
  }

  public static createUserId() {
    window.localStorage.setItem("userId", uuid());
    if (!this.hasUserId()) {
      throw new Error("User id could not be created in local storage.");
    }
  }

  public static async deleteUserId() {
    const response = await axios.delete(
      "http://localhost:7071/api/delete-user?id=" + this.getUserId()
    );

    if (response.status.toString().startsWith("2")) {
      throw new Error("Server did not respond with status 2xx.");
    }

    window.localStorage.removeItem("userId");

    if (this.hasUserId()) {
      throw new Error("User id could not be deleted from local storage.");
    }
  }
}
