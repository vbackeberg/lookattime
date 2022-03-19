import store from "@/store/store";
import FullscreenEventTarget from "./fullscreen-event-target";

export default class FullscreenRepositioner {
  private constructor() {
    // FullscreenEventTarget.Instance.addEventListener(
    //   "fullscreen-toggled",
    //   this.reposition
    // );
  }

  private reposition = (e: Event) => {
    (e as CustomEvent).detail.timeEvent.positionCenter += "50%";
  };

  private static instance: FullscreenRepositioner;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
