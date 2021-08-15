import TimeEventModel from "@/models/time-event-model";
import TimeMarker from "@/models/time-marker";
import SpacerModel from "@/models/spacer-model";
import Vue from "vue";
import Vuex from "vuex";
import { v4 as uuid } from "uuid";
import ViewResetter from "@/timeline/viewport/view-resetter";
import HttpClient from "@/api/http-client";
import UserModel from "@/models/user-model";
import TimelineModel from "@/models/timeline-model";
import UserLocalStorage from "@/local-storage/user-local-storage";
import SelectedTimelineLocalStorage from "@/local-storage/selected-timeline-local-storage";
import AddTimeEventModel from "./add-time-event-model";
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [],

  state: {
    timelineElement: {} as HTMLElement,
    timelineZero: 0,
    zoomLevel: 1,

    timeEvents: [] as TimeEventModel[],

    spacerViewportRight: {} as SpacerModel,
    spacerLeft: {} as SpacerModel,
    spacerRight: {} as SpacerModel,

    timeMarkers: [] as TimeMarker[],
    timeMarkerDepth: 1,

    selectedTimeline: {} as TimelineModel,
    timelines: [] as TimelineModel[],

    user: {} as UserModel,
    loading: true
  },

  getters: {
    viewMode(state): boolean {
      return !state.timelines.includes(state.selectedTimeline);
    }
  },

  mutations: {
    setTimeEvents(state, timeEvents: TimeEventModel[]) {
      timeEvents.sort((a, b) => a.positionCenter - b.positionCenter);
      state.timeEvents = timeEvents;
    },

    addTimeEvent(state, timeEvent: TimeEventModel) {
      state.timeEvents.push(timeEvent);
      state.timeEvents.sort((a, b) => a.positionCenter - b.positionCenter);
    },

    deleteTimeEvent(state, timeEventId) {
      const index = state.timeEvents.findIndex(
        timeEvent => timeEvent.id === timeEventId
      );
      if (index === -1) {
        console.warn(
          "Error deleting time event. Time event to delete was not found."
        );
      } else {
        state.timeEvents.splice(index, 1);
      }
    },

    updateTimeEvent(state, timeEvent: TimeEventModel) {
      const index = state.timeEvents.findIndex(timeEvent => timeEvent.id);
      state.timeEvents[index] = timeEvent;
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
    },

    setLoading(state, loading: boolean) {
      state.loading = loading;
    }
  },

  actions: {
    async deleteTimeEvent(
      { commit, state },
      timeEventId: string
    ): Promise<void> {
      return HttpClient.deleteTimeEvent(
        timeEventId,
        state.selectedTimeline.id,
        state.user.id
      ).then(() => commit("deleteTimeEvent", timeEventId));
    },

    async updateTimeEvent(
      { commit, state },
      addTimeEventModel: AddTimeEventModel
    ): Promise<void> {
      return HttpClient.updateTimeEvent(
        addTimeEventModel.timeEvent,
        state.selectedTimeline.id,
        state.user.id,
        addTimeEventModel.images
      ).then(() => commit("updateTimeEvent", addTimeEventModel.timeEvent));
    },

    async addTimeEvent(
      { commit, state },
      addTimeEventModel: AddTimeEventModel
    ): Promise<void> {
      return HttpClient.createTimeEvent(
        addTimeEventModel.timeEvent,
        state.selectedTimeline.id,
        state.user.id,
        addTimeEventModel.images
      ).then(() => commit("addTimeEvent", addTimeEventModel.timeEvent));
    },

    async loadTimeEvents({ commit, state }): Promise<void> {
      ViewResetter.Instance.resetView();

      const timeEvents = await HttpClient.getTimeEvents(
        state.selectedTimeline.id
      );

      commit("setTimeEvents", timeEvents);

      if (timeEvents.length > 0) {
        await ViewResetter.Instance.initiateView();
      }
    },

    async setSelectedTimeline(
      { commit, dispatch },
      timeline: TimelineModel
    ): Promise<void> {
      commit("setSelectedTimeline", timeline);
      SelectedTimelineLocalStorage.Instance.setSelectedTimelineId(timeline.id);
      await dispatch("loadTimeEvents");
    },

    async addTimeline({ commit }, timeline: TimelineModel): Promise<void> {
      await HttpClient.createTimeline(timeline);
      commit("addTimeline", timeline);
    },

    async loadTimelines({ commit, dispatch, state }): Promise<void> {
      const timelines = await HttpClient.getTimelines(state.user.id);

      if (timelines.length > 0) {
        commit("setTimelines", timelines);
        const selectedTimelineId = SelectedTimelineLocalStorage.Instance.getSelectedTimelineId();

        const timelineFound = timelines.find(
          timeline => timeline.id === selectedTimelineId
        );

        if (timelineFound) {
          await dispatch(
            "setSelectedTimeline",
            timelines.find(timeline => timeline.id === selectedTimelineId)
          );
        } else {
          await dispatch("setSelectedTimeline", timelines[0]);
        }
      } else {
        await dispatch(
          "addTimeline",
          new TimelineModel(uuid(), state.user.id, "My timeline")
        );
        await dispatch("setSelectedTimeline", state.timelines[0]);
      }
    },

    async loadUser({ commit, dispatch }): Promise<void> {
      const userId = UserLocalStorage.Instance.getUserId();

      let user: UserModel;
      try {
        user = await HttpClient.getUser(userId);
      } catch (e) {
        console.info("The specified user was not found. Recreating it...");
        user = { id: userId, name: "Time traveler" } as UserModel;
        await HttpClient.createUser(user);
      }

      commit("setUser", user);
      await dispatch("loadTimelines");
    }
  },

  modules: {}
});
