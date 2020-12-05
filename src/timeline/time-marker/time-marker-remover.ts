import store from '@/store';

export default class TimeMarkerRemover {

  public removeMarkersLeft() {
    const leftEdge = Math.min(0, store.getters.spacerLeft.positionLeft);

    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > leftEdge
    );

    console.log("Remove markers below index: " + index);

    if (index > 0) {
      store.commit("setTimeMarkers", store.state.timeMarkers.slice(index));
    }
  }

  public removeMarkersRight() {
    const rightEdge = Math.max(
      store.getters.spacerRight.positionLeft + store.getters.spacerRight.width,
      store.state.spacerPageEdge.positionLeft + store.state.spacerPageEdge.width
    );

    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > rightEdge
    );

    console.log("Remove markers above index: " + index);

    if (index > -1) {
      store.commit("setTimeMarkers", store.state.timeMarkers.slice(0, index));
    }
  }


  private static instance: TimeMarkerRemover;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
