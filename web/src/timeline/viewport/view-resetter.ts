import { useLookAtTime } from "@/store/store";
import SpaceAllocator from "../space-management/space-allocator";
import TimeMarkerRemover from "../time-marker-management/time-marker-remover";
import { Constants } from "../zooming/constants";
import ViewFocuser from "./view-focuser";
import { nextTick } from "vue";

/**
 * Resets the viewport (when loading a new timeline).
 */
export default class ViewResetter {
  private viewFocuser = ViewFocuser.Instance;
  private spaceAllocator = SpaceAllocator.Instance;
  private timeMarkerRemover = TimeMarkerRemover.Instance;
  private constructor(private store = useLookAtTime()) { }

  public resetView() {
    this.store.timelineZero = this.store.timelineElement!.clientWidth / 2;
    this.timeMarkerRemover.removeAllMarkers();
    this.store.timeMarkerDepth = 1; // TODO obsolete, remove
    this.store.zoomLevel = Constants.MAX_ZOOM_LEVEL;
    this.repositionSpacerViewportRight();
  }

  public async initiateView() {
    const expendableLeftSpace = Math.min(
      this.store.spacerLeft!.positionLeft,
      this.store.timelineElement!.scrollLeft
    );

    if (expendableLeftSpace > 0) {
      // TODO: Maybe we don'tneed to cut, just extend.
      this.spaceAllocator.cutoffLeftSpace(
        this.store.timelineElement!,
        expendableLeftSpace
      );
    } else if (this.store.spacerLeft!.positionLeft < 0) {
      this.spaceAllocator.extendLeftSpace(
        this.store.timelineElement!,
        -this.store.spacerLeft!.positionLeft
      );
    }

    await nextTick();
    this.focusView();
  }

  private focusView() {
    if (this.store.timeEvents.length === 0) {
      this.store.timelineElement!.scrollTo({ left: 0 });
    } else if (this.store.timeEvents.length === 1) {
      this.viewFocuser.focusOnPosition(
        this.store.timeEvents[0].positionCenter
      );
    } else {
      this.viewFocuser.focusOnRange(
        this.store.timeEvents[0].positionCenter,
        this.store.timeEvents[this.store.timeEvents.length - 1].positionCenter
      );
    }
  }

  private repositionSpacerViewportRight() {
    this.store.spacerViewportRight!.positionLeft = 0;
  }

  private static instance: ViewResetter;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
