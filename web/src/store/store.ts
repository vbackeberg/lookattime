import TimeEventModel from "@/models/time-event-model";
import TimeMarkerModel from "@/models/time-marker-model";
import SpacerModel from "@/models/spacer-model";
import Vue from "vue";
import Vuex from "vuex";
import Database from "@/local-database/database";
import { v4 as uuid } from "uuid";
import ViewResetter from "@/timeline/viewport/view-resetter";
import HttpClient from "@/api/http-client";
import UserModel from "@/models/user-model";
import UserApiMapper from "@/api/user/user-api-mapper";
import TimelineModel from "@/models/timeline-model";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [],

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

    selectedTimeline: {} as TimelineModel,
    timelines: [] as TimelineModel[],

    user: {} as UserModel
  },

  getters: {
    spacerLeft(state): SpacerModel {
      const lowestTimeEvent = state.timeEvents[0];

      if (!lowestTimeEvent) {
        return {
          positionLeft: 0,
          width: state.timelineElement.clientWidth / 2
        } as SpacerModel;
      } else {
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
      }
    },

    spacerRight(state): SpacerModel {
      const highestTimeEvent = state.timeEvents[state.timeEvents.length - 1];

      if (!highestTimeEvent) {
        return {
          positionLeft: 0 + state.timelineElement.clientWidth / 2,
          width: state.timelineElement.clientWidth / 2
        } as SpacerModel;
      } else {
        return {
          positionLeft:
            highestTimeEvent?.positionCenter + TimeEventModel.expandedWidth / 2,
          width:
            state.timelineElement.clientWidth / 2 -
            TimeEventModel.expandedWidth / 2
        } as SpacerModel;
      }
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

    setSelectedTimeline(state, timeline: TimelineModel) {
      state.selectedTimeline = timeline;
    },

    setTimelines(state, timelines: TimelineModel[]) {
      state.timelines = timelines;
    },

    addTimeline(state, timeline: TimelineModel) {
      state.timelines.push(timeline);
    },

    setUser(state, user: UserModel) {
      state.user = user;
    }
  },

  actions: {
    async setTimeMarkers({ commit }, timeMarkers: TimeMarkerModel[]) {
      commit("setTimeMarkers", timeMarkers);
    },

    async pushTimeMarkers({ commit }, timeMarkers: TimeMarkerModel[]) {
      commit("pushTimeMarkers", timeMarkers);
    },

    async unshiftTimeMarkers({ commit }, timeMarkers: TimeMarkerModel[]) {
      commit("unshiftTimeMarkers", timeMarkers);
    },

    async addTimeEvent({ commit, state }, timeEvent: TimeEventModel) {
      HttpClient.createTimeEvent(
        timeEvent,
        state.selectedTimeline.id,
        state.user.id
      );
      commit("addTimeEvent", timeEvent);
    },

    async loadTimeEvents({ commit, state }) {
      const timeEvents = await HttpClient.getTimeEvents(
        state.selectedTimeline.id
      );

      commit("setTimeEvents", timeEvents);

      ViewResetter.Instance.initiate();
    },

    async setSelectedTimeline({ commit, dispatch }, timeline: TimelineModel) {
      commit("setSelectedTimeline", timeline);
      dispatch("loadTimeEvents");
    },

    async addTimeline({ commit }, timeline: TimelineModel) {
      HttpClient.createTimeline(timeline);
      commit("addTimeline", timeline);
    },

    async loadTimelines({ commit, dispatch, state }) {
      const timelines = await HttpClient.getTimelines(state.user.id);

      if (timelines.length > 0) {
        commit("setTimelines", timelines);
        dispatch("setSelectedTimeline", timelines[0]);
      } else {
        await dispatch(
          "addTimeline",
          new TimelineModel(uuid(), this.state.user.id, "My timeline")
        );
        dispatch("setSelectedTimeline", state.timelines[0]);
      }
    },

    async setUser({ commit, dispatch }, user) {
      commit("setUser", user);
      dispatch("loadTimelines");
    },

    async loadUser({ dispatch }) {
      const database = Database.Instance;

      let user = await database.getUser();
      if (!user) {
        await database.createUser(new UserModel(uuid(), "User Name"));
      }

      try {
        await HttpClient.getUser(user.id);
      } catch (e) {
        console.log(e);
        await HttpClient.createUser(user);
      }

      dispatch("setUser", user);
    }
  },

  modules: {}
});
