import TimeEventModel from "@/models/time-event-model";
import TimeMarkerModel from "@/models/time-marker-model";
import SpacerModel from "@/models/spacer-model";
import Vue from "vue";
import Vuex from "vuex";
import Database from "@/local-database/database";
import Timeline from "@/api/timeline/timeline";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    timelineElement: {} as HTMLElement,
    timelineZero: 0,
    zoomLevel: 1,

    timeEvents: [] as TimeEventModel[],

    spacerPageEdge: {
      positionLeft: 0,
      width: 1
    } as SpacerModel,

    timeMarkers: [] as TimeMarkerModel[],
    timeMarkerDepth: 1,

    userId: "",
    selectedTimelineId: "",
    timelines: [] as Timeline[]
  },

  getters: {
    spacerLeft(state): SpacerModel {
      const lowestTimeEvent = state.timeEvents[0];
      const width =
        state.timelineElement.clientWidth / 2 -
        TimeEventModel.expandedWidth / 2;

      return {
        positionLeft:
          lowestTimeEvent?.positionCenter -
          TimeEventModel.expandedWidth / 2 -
          width,
        width: width
      } as SpacerModel;
    },

    spacerRight(state): SpacerModel {
      const highestTimeEvent = state.timeEvents[state.timeEvents.length - 1];

      return {
        positionLeft:
          highestTimeEvent?.positionCenter + TimeEventModel.expandedWidth / 2,
        width:
          state.timelineElement.clientWidth / 2 -
          TimeEventModel.expandedWidth / 2
      } as SpacerModel;
    },

    leftEdge(_, getters): number {
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
    },

    timeMarkersVisible(state): TimeMarkerModel[] {
      return state.timeMarkers.filter(marker => marker.show);
    },

    timeEventsVisible(state): TimeEventModel[] {
      return state.timeEvents.filter(timeEvent => timeEvent.show);
    }
  },

  mutations: {
    setTimelineZero(state, value: number) {
      state.timelineZero = value;
    },

    changeZoomLevel(state, value: number) {
      state.zoomLevel *= value;
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
    },

    setTimeEvents(state, timeEvents: TimeEventModel[]) {
      state.timeEvents = timeEvents;
    },

    addTimeEvent(state, timeEvent: TimeEventModel) {
      state.timeEvents.push(timeEvent);
      state.timeEvents.sort((a, b) => a.positionCenter - b.positionCenter);
    },

    setUserId(state, id: string) {
      state.userId = id;
    },

    setSelectedTimelineId(state, id: string) {
      state.selectedTimelineId = id;
    },

    setTimelines(state, timelines: Timeline[]) {
      state.timelines = timelines;
    },

    addTimeline(state, timeline: Timeline) {
      state.timelines.push(timeline)
    }
  },

  actions: {
    async loadTimeEvents({ commit }) {
      const timeEvents = await Database.Instance.getTimeEvents(
        this.state.selectedTimelineId
      );

      timeEvents.sort((a, b) => a.positionCenter - b.positionCenter);

      commit("setTimeEvents", timeEvents);
    },

    async addTimeEvent({ commit }, timeEvent: TimeEventModel) {
      if (this.state.userId) {
        Database.Instance.postTimeEvent(
          timeEvent,
          this.state.selectedTimelineId
        );
      }
      commit("addTimeEvent", timeEvent);
    },

    async loadTimelines({ commit, dispatch }) {
      const timelines = await Database.Instance.getTimelines(this.state.userId);
      commit("setTimelines", timelines);

      if (timelines[0]) {
        commit("setSelectedTimelineId", timelines[0]);
        dispatch("loadTimeEvents");
      }
    },

    async addTimeline({ commit }, timeline: Timeline) {
      Database.Instance.postTimeline(timeline);
      commit("addTimeline", timeline);
    },

    async setUserId({ commit, dispatch }, userId) {
      commit("setUserId", userId);

      dispatch("loadTimelines");
    }
  },

  modules: {}
});
