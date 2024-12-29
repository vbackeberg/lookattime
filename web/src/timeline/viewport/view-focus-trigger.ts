import { useLookAtTime } from "@/store/store";
import ViewFocuser from "./view-focuser";
import ViewResetter from "./view-resetter";

/**
 * Refocuses the view when time events are set, added or updated.
 */
export default class ViewFocusTrigger {
  private viewFocuser: ViewFocuser;
  private viewResetter: ViewResetter;
  private store = useLookAtTime();

  private constructor() {
    this.viewFocuser = ViewFocuser.Instance;
    this.viewResetter = ViewResetter.Instance;

    this.store.$onAction(
      ({ name, args, after }) => {
        if (name === "setTimeEvents") {
          after(async () => {
            if (args[0].length > 0) {
              await this.viewResetter.initiateView();
            }
          })
        }

        if (name === "addTimeEvent") {
          after(async () => {
            if (this.store.timeEvents.length < 3) {
              await this.viewResetter.initiateView();
            } else {
              this.viewFocuser.extendFocus(args[0].positionCenter);
            }
          })
        }

        if (name === "updateTimeEvent") {
          after(() => {
            this.viewFocuser.extendFocus(args[0].positionCenter);
          })
        }
      }
    )
  }

  private static instance: ViewFocusTrigger;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
