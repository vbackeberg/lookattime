import store from "@/store";

export default class TimeMarkerRemover {
  public removeMarkersLeft() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > store.getters.leftEdge
    );

    if (index > 0) {
      console.log("Remove markers below index: " + index);
      store.commit("setTimeMarkers", store.state.timeMarkers.slice(index));
    }
  }

  public removeMarkersRight() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > store.getters.rightEdge
    );

    if (index > -1) {
      console.log("Remove markers above index: " + index);
      store.commit("setTimeMarkers", store.state.timeMarkers.slice(0, index));
    }
  }

  private static instance: TimeMarkerRemover;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
