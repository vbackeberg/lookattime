import BoxModel from "@/models/box-model";
import TimeMarkerModel from "@/models/time-marker-model";
import SpacerModel from "@/models/spacer-model";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    timelineZero: 0,
    zoomLevel: 1,

    boxes: [] as BoxModel[],

    spacerPageEdge: {
      positionLeft: 0,
      width: 1
    } as SpacerModel,

    timeMarkers: [] as TimeMarkerModel[],
    timeMarkerDepth: 1
  },

  getters: {
    spacerLeft(state): SpacerModel {
      const lowestBox = state.boxes[0];

      const timelineElement = document.getElementById(
        "timeline"
      ) as HTMLElement;
      const width =
        timelineElement?.clientWidth / 2 - BoxModel.expandedWidth / 2;

      return {
        positionLeft:
          lowestBox?.positionCenter - BoxModel.expandedWidth / 2 - width,
        width: width
      } as SpacerModel;
    },

    spacerRight(state): SpacerModel {
      const highestBox = state.boxes[state.boxes.length - 1];

      // TODO: Problem: How to avoid recalculation?
      // Mutation: Set timelineElement in store. Call it on timeline mounted.
      const timelineElement = document.getElementById(
        "timeline"
      ) as HTMLElement;

      return {
        positionLeft: highestBox?.positionCenter + BoxModel.expandedWidth / 2,
        width: timelineElement?.clientWidth / 2 - BoxModel.expandedWidth / 2
      } as SpacerModel;
    },

    leftEdge(state, getters): number {
      return Math.min(0, getters.spacerLeft.positionLeft);
    },

    rightEdge(state, getters): number {
      return Math.max(
        getters.spacerRight.positionLeft + getters.spacerRight.width,
        state.spacerPageEdge.positionLeft + state.spacerPageEdge.width
      );
    },

    timeMarkerDistance(state): number {
      return state.timeMarkers.length < 2
        ? 0
        : state.timeMarkers[1].positionCenter -
            state.timeMarkers[0].positionCenter;
    }
  },

  mutations: {
    setTimelineZero(state, value: number) {
      state.timelineZero = value;
    },

    changeZoomLevel(state, value: number) {
      state.zoomLevel *= value;
    },

    addBox(state, box: BoxModel) {
      state.boxes.push(box);
      state.boxes.sort((a, b) => a.positionCenter - b.positionCenter);
    },

    setSpacerPageEdgePosition(state, positionLeft: number) {
      state.spacerPageEdge.positionLeft = positionLeft;
    },

    setTimeMarkers(state, markers: TimeMarkerModel[]) {
      state.timeMarkers = markers;
    },

    pushTimeMarkers(state, markers: TimeMarkerModel[]) {
      state.timeMarkers.push(...markers);
    },

    unshiftTimeMarkers(state, markers: TimeMarkerModel[]) {
      state.timeMarkers.unshift(...markers);
    },

    setTimeMarkerDepth(state, value: number) {
      state.timeMarkerDepth = value;
    }
  },

  actions: {},

  modules: {}
});
