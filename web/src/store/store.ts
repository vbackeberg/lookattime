import TimeEventModel from "@/models/time-event-model";
import TimeMarkerModel from "@/models/time-marker-model";
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

    spacerPageEdge: {
      positionLeft: 0,
      width: 1
    } as SpacerModel,

    timeMarkers: [] as TimeMarkerModel[],
    timeMarkerDepth: 1,

    selectedTimeline: {} as TimelineModel,
    timelines: [] as TimelineModel[],

    user: {} as UserModel,
    loading: true
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
            lowestTimeEvent.positionCenter -
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
            highestTimeEvent.positionCenter + TimeEventModel.expandedWidth / 2,
          width:
            state.timelineElement.clientWidth / 2 -
            TimeEventModel.expandedWidth / 2
        } as SpacerModel;
      }
    },

    /**
     * The left edge of the timeline is either a negative position
     * of the left spacer's left edge or 0.
     *
     * @param _
     * @param getters
     * @returns the left edge of the timeline in absolute numbers.
     */
    leftEdge(_, getters): number {
      return Math.min(0, getters.spacerLeft.positionLeft);
    },

    /**
     * The right edge of the timeline is either the position of the
     * right spacer's right edge or the position of the page edge spacer's
     * right edge.
     *
     * @param state
     * @param getters
     * @returns the right edge of the timeline in absolute numbers.
     */
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
    },

    viewMode(state): boolean {
      return !state.timelines.includes(state.selectedTimeline);
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
    async setTimeMarkers(
      { commit },
      timeMarkers: TimeMarkerModel[]
    ): Promise<void> {
      commit("setTimeMarkers", timeMarkers);
    },

    async pushTimeMarkers(
      { commit },
      timeMarkers: TimeMarkerModel[]
    ): Promise<void> {
      commit("pushTimeMarkers", timeMarkers);
    },

    async unshiftTimeMarkers(
      { commit },
      timeMarkers: TimeMarkerModel[]
    ): Promise<void> {
      commit("unshiftTimeMarkers", timeMarkers);
    },

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

      await ViewResetter.Instance.initiateView();
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
