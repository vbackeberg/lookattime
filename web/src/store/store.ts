import HttpClient from "@/api/http-client";
import SelectedTimelineLocalStorage from "@/local-storage/selected-timeline-local-storage";
import UserLocalStorage from "@/local-storage/user-local-storage";
import Spacer from "@/models/spacer";
import TimeEventModel from "@/models/time-event-model";
import TimeMarker from "@/models/time-marker";
import TimelineModel from "@/models/timeline-model";
import UserModel from "@/models/user-model";
import ViewResetter from "@/timeline/viewport/view-resetter";
import { v4 as uuid } from "uuid";
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [],

  state: {
    timelineElement: {} as HTMLElement,
    timelineZero: 0,

    /**
     * The zoom level determines how many seconds are represented by one pixel.
     * A zoom level of 335 means that one pixel covers a timespan of 335 seconds.
     * The smaller the zoom level the bigger the distance between time events (zoom out).
     */
    zoomLevel: 1728000000000,

    timeEvents: [] as TimeEventModel[],

    /**
     * Id of the temporary time event that is locally being
     * added to timeEvents when creating a new time event.
     */
    timeEventToBeCreated: null as TimeEventModel | null,

    /**
     * Assures the screen does not get pushed to the left
     * when spacer right falls below right screen edge on
     * space cutting.
     */
    spacerViewportRight: {} as Spacer,
    spacerLeft: {} as Spacer,
    spacerRight: {} as Spacer,

    timeMarkers: [] as TimeMarker[],
    timeMarkerDepth: 1,

    selectedTimeline: {} as TimelineModel,
    timelines: [] as TimelineModel[],

    user: {} as UserModel,
    loading: true
  },

  getters: {
    readOnlyMode(state): boolean {
      return !state.timelines.includes(state.selectedTimeline);
    }
  },

  mutations: {
    setTimeEvents(state, timeEvents: TimeEventModel[]) {
      timeEvents.sort((a, b) => a.date - b.date);
      state.timeEvents = timeEvents;
    },

    addTimeEvent(state, timeEvent: TimeEventModel) {
      state.timeEvents.push(timeEvent);
      state.timeEvents.sort((a, b) => a.date - b.date);
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

    updateTimeEvent(
      state,
      payload: { changedTimeEvent: TimeEventModel; index: number }
    ) {
      state.timeEvents[payload.index] = payload.changedTimeEvent;
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
    },

    setTimeEventToBeCreated(state, timeEvent: TimeEventModel) {
      state.timeEventToBeCreated = timeEvent;
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

    async createOrUpdateTimeEvent(
      { commit, state },
      changedTimeEvent: TimeEventModel
    ): Promise<void> {
      await HttpClient.createOrUpdateTimeEvent(
        changedTimeEvent,
        state.selectedTimeline.id,
        state.user.id
      );

      const index = state.timeEvents.findIndex(
        timeEvent => timeEvent.id === changedTimeEvent.id
      );
      if (index === -1) {
        commit("addTimeEvent", changedTimeEvent);
      } else {
        commit("updateTimeEvent", { changedTimeEvent, index });
      }
    },

    async loadTimeEvents({ commit, state }): Promise<void> {
      ViewResetter.Instance.resetView();

      const timeEvents = await HttpClient.getTimeEvents(
        state.selectedTimeline.id
      );

      commit("setTimeEvents", timeEvents);
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
