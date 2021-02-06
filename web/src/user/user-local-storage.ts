import { v4 as uuid, validate as validUuid } from "uuid";

export default class UserLocalStorage {
  private constructor() {
    if (this.hasUserId()) {
    } else {
      this.createUserId();
    }
  }

  public getUserId(): string {
    if (this.hasUserId()) {
      return window.localStorage.getItem("userId") as string;
    } else {
      throw new Error("No user id in local storage.");
    }
  }

  private hasUserId(): boolean {
    const userId = window.localStorage.getItem("userId");

    if (!userId || !validUuid(userId)) return false;
    return true;
  }

  private createUserId() {
    const userId = uuid();

    window.localStorage.setItem("userId", userId);
  }

  public deleteUserId() {
    window.localStorage.removeItem("userId");

    if (this.hasUserId()) {
      throw new Error("User id could not be deleted from local storage.");
    }
  }

  private static instance: UserLocalStorage;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
