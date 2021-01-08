import TimeEventModel from "@/models/time-event-model";
import store from "@/store";
import { MutationPayload, Store } from "vuex";
import ViewFocuser from "./view-focuser";

class ViewResetter {
  private viewFocuser: ViewFocuser;
  private constructor() {
    this.viewFocuser = ViewFocuser.Instance;
  }
  public focus(mutation: MutationPayload) {
    this.viewFocuser.focusOnTimeEvent(mutation.payload[0] as TimeEventModel);

    // if (state.timeEvents.length === 1) {
    //   viewFocuser.focusOnTimeEvent(state.timeEvents[0]);
    // } else if (store.state.timeEvents.length === 2) {
    //   this.viewFocuser.focusOnRange(
    //     store.state.timeEvents[0].date,
    //     store.state.timeEvents[1].date
    //   );
    // } else if (store.state.timeEvents.length > 2) {
    //   viewFocuser.focusOnTimeEvent();
    // }
  }

  private static instance: ViewResetter;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}

export default function viewReset(store: Store<any>) {
  store.subscribe(mutation => {
    if (mutation.type === "setTimeEvents") {
      ViewResetter.Instance.focus(mutation);
      console.log("plugin" + mutation.type);
    }
  });
}
