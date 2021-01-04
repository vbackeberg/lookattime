import Database from "@/local-database/database";
import store from "@/store";
import { v4 as uuid, validate as validUuid } from "uuid";

export default class UserService {
  private static getUserId(): string {
    if (this.hasUserId()) {
      return window.localStorage.getItem("userId") as string;
    } else {
      throw new Error("No user id in local storage.");
    }
  }

  private static hasUserId(): boolean {
    const userId = window.localStorage.getItem("userId");

    if (!userId || !validUuid(userId)) return false;
    return true;
  }

  public static async createUserId() {
    const userId = uuid();

    window.localStorage.setItem("userId", userId);

    await Database.Instance.postUser(this.getUserId(), "User name");

    store.commit("setUserId", userId);
  }

  public static async deleteUserId() {
    await Database.Instance.deleteUser(this.getUserId());

    window.localStorage.removeItem("userId");

    if (this.hasUserId()) {
      throw new Error("User id could not be deleted from local storage.");
    }

    store.commit("setUserId", "");
  }
}
