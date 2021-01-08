import TimeEventModel from "@/models/time-event-model";
import TimeMarkerModel from "@/models/time-marker-model";
import SpacerModel from "@/models/spacer-model";
import Vue from "vue";
import Vuex from "vuex";
import Database from "@/local-database/database";
import Timeline from "@/api/timeline/timeline";
import ViewFocuser from "@/timeline/view-focuser";
import { v4 as uuid } from "uuid";
import TimeMarkerCreator from "@/timeline/time-marker-management/time-marker-creator";
import User from "@/api/user/user";

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

    selectedTimeline: {} as Timeline,
    timelines: [] as Timeline[],

    user: {} as User
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
      timeEvents.sort((a, b) => a.positionCenter - b.positionCenter);
      state.timeEvents = timeEvents;
    },

    addTimeEvent(state, timeEvent: TimeEventModel) {
      state.timeEvents.push(timeEvent);
      state.timeEvents.sort((a, b) => a.positionCenter - b.positionCenter);
    },

    setSelectedTimeline(state, timeline: Timeline) {
      state.selectedTimeline = timeline;
    },

    setTimelines(state, timelines: Timeline[]) {
      state.timelines = timelines;
    },

    addTimeline(state, timeline: Timeline) {
      state.timelines.push(timeline);
    },

    setUser(state, user: User) {
      state.user = user;
    }
  },

  actions: {
    async loadTimeEvents({ commit, state }) {
      const timeEvents = await Database.Instance.getTimeEvents(
        state.selectedTimeline.id
      );

      commit("setTimeEvents", timeEvents);

      const viewFocuser = ViewFocuser.Instance;

      if (state.timeEvents.length === 1) {
        viewFocuser.focusOnTimeEvent(state.timeEvents[0]);
      } else if (state.timeEvents.length > 1) {
        viewFocuser.focusOnRange(
          state.timeEvents[0].date,
          state.timeEvents[state.timeEvents.length - 1].date
        );
      }
      }
    },

    async addTimeEvent({ commit, state }, timeEvent: TimeEventModel) {
      Database.Instance.postTimeEvent(timeEvent, state.selectedTimeline.id);
      commit("addTimeEvent", timeEvent);
    },

    async loadTimelines({ commit, dispatch, state }) {
      const timelines = await Database.Instance.getTimelines(state.user.id);

      if (timelines.length > 0) {
        commit("setTimelines", timelines);
        dispatch("setSelectedTimeline", timelines[0]);
      } else {
        dispatch("addTimeline", {
          id: uuid(),
          userId: this.state.user.id,
          title: "My timeline"
        } as Timeline);
      }
    },

    async addTimeline({ commit }, timeline: Timeline) {
      Database.Instance.postTimeline(timeline);
      commit("addTimeline", timeline);
    },

    async setSelectedTimeline({ commit, dispatch }, timeline: Timeline) {
      commit("setSelectedTimeline", timeline);
      dispatch("loadTimeEvents");
    },

    async setUser({ commit, dispatch }, user) {
      commit("setUser", user);
      dispatch("loadTimelines");
    },

    async loadUser({ dispatch }) {
      const database = Database.Instance;

      let user = await database.getUser();
      if (!user) {
        user = { id: uuid(), name: "User Name" } as User;
        await database.postUser(user);
      }

      dispatch("setUser", user);
    }
  },

  modules: {}
});
