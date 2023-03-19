import HttpClient from "@/api/http-client";
import SelectedTimelineLocalStorage from "@/local-storage/selected-timeline-local-storage";
import UserLocalStorage from "@/local-storage/user-local-storage";
import Spacer from "@/models/spacer";
import TimeEventModel from "@/models/time-event/time-event-model";
import TimeMarker from "@/models/time-marker";
import TimelineModel from "@/models/timeline-model";
import UserModel from "@/models/user-model";
import ViewResetter from "@/timeline/viewport/view-resetter";
import { v4 as uuid, validate as validUuid } from "uuid";
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
     * The lower the zoom level the bigger the distance between time events (zoom out).
     */
    zoomLevel: 1_728_000_000_000,

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
    timelines: [] as TimelineModel[], // TODO change to new array syntax

    user: {} as UserModel,
    loading: true,
    showIntroduction: true
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
        (timeEvent) => timeEvent.id === timeEventId
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
      state.timeEvents[payload.index].title = payload.changedTimeEvent.title;
      state.timeEvents[payload.index].text = payload.changedTimeEvent.text;
      state.timeEvents[payload.index].date = payload.changedTimeEvent.date;
      state.timeEvents[payload.index].importance =
        payload.changedTimeEvent.importance;
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

    setShowIntroduction(state, showIntroduction: boolean) {
      state.showIntroduction = showIntroduction;
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
        (timeEvent) => timeEvent.id === changedTimeEvent.id
      );
      if (index === -1) {
        commit("addTimeEvent", changedTimeEvent);
      } else {
        commit("updateTimeEvent", { changedTimeEvent, index });
      }
    },

    /**
     * Loads all time events for a given timeline.
     *
     * Sets loading true when starting and false after finished.
     */
    async loadTimeEvents({ commit, state }): Promise<void> {
      commit("setLoading", true);

      ViewResetter.Instance.resetView();

      const timeEvents = await HttpClient.getTimeEvents(
        state.selectedTimeline.id
      );

      commit("setTimeEvents", timeEvents);
      commit("setLoading", false);
    },

    async setSelectedTimeline(
      { commit, dispatch },
      timeline: TimelineModel
    ): Promise<void> {
      commit("setSelectedTimeline", timeline);
      SelectedTimelineLocalStorage.setSelectedTimelineId(timeline.id);
      await dispatch("loadTimeEvents");
    },

    async addTimeline({ commit }, timeline: TimelineModel): Promise<void> {
      await HttpClient.createTimeline(timeline);
      commit("addTimeline", timeline);
    },

    /**
     * Fetches all timelines from the server.
     *
     * Then sets either one of the following timelines as selected:
     * - the timeline specified in the query parameters if there is one,
     * - the timeline specified in local storage.
     * - the first timeline if
     *  - the user has not selected a timeline,
     *  - or its id is not in timelines,
     *
     * @param param0
     * @returns
     */
    async loadTimelines({ commit, dispatch, state }): Promise<void> {
      const timelines = await HttpClient.getTimelines(state.user.id);

      if (timelines.length > 0) {
        commit("setTimelines", timelines);
      } else {
        await dispatch(
          "addTimeline",
          new TimelineModel(uuid(), state.user.id, "My timeline")
        );
      }

      // Case shared timeline
      const timelineIdQueryParam = new URLSearchParams(
        window.location.search
      ).get("timeline");

      if (timelineIdQueryParam && validUuid(timelineIdQueryParam)) {
        return await dispatch(
          "setSelectedTimeline",
          new TimelineModel(
            timelineIdQueryParam as string,
            "",
            "Shared timeline"
          )
        );
      }

      // Case last selected timeline
      const timelineIndex = state.timelines.findIndex(
        (timeline) =>
          timeline.id === SelectedTimelineLocalStorage.getSelectedTimelineId()
      );

      if (timelineIndex !== -1) {
        return await dispatch(
          "setSelectedTimeline",
          state.timelines[timelineIndex]
        );
      }

      // Case fallback to first timeline
      await dispatch("setSelectedTimeline", state.timelines[0]);
    },

    /**
     * First loads the given user or creates a new one if no user
     * exists.
     *
     * Then loads timelines for user.
     *
     * Sets loading true when starting.
     */
    async loadUser({ commit, dispatch }): Promise<void> {
      commit("setLoading", true);

      const userId = UserLocalStorage.getUserId();

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
