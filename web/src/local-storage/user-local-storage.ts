import { v4 as uuid, validate as validUuid } from "uuid";

export default class UserLocalStorage {
  public static getUserId(): string {
    if (!this.hasUserId()) {
      this.createUserId();
    }

    return window.localStorage.getItem("userId") as string;
  }

  private static hasUserId(): boolean {
    const userId = window.localStorage.getItem("userId");

    if (!userId || !validUuid(userId)) return false;
    return true;
  }

  private static createUserId() {
    const userId = uuid();

    window.localStorage.setItem("userId", userId);
  }

  public static deleteUserId() {
    window.localStorage.removeItem("userId");

    if (this.hasUserId()) {
      throw new Error("User id could not be deleted from local storage.");
    }
  }
}
