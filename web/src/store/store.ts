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
import { defineStore } from 'pinia'

interface State {
  /**
     * The zoom level determines how many seconds are represented by one pixel.
     * A zoom level of 335 means that one pixel covers a timespan of 335 seconds.
     * The lower the zoom level the bigger the distance between time events (zoom out).
     */
  zoomLevel: number,

  timeEvents: TimeEventModel[],

  /**
   * The temporary time event that is locally being
   * added to timeEvents when creating a new time event.
   */
  timeEventToBeCreated?: TimeEventModel,

  /**
   * Assures the screen does not get pushed to the left
   * when spacer right falls below right screen edge on
   * space cutting.
   */
  spacerViewportRight?: Spacer,
  spacerLeft?: Spacer,
  spacerRight?: Spacer,

  timeMarkers: TimeMarker[],
  timeMarkerDepth: number,

  selectedTimeline?: TimelineModel,
  timelines: TimelineModel[], // TODO change to new array syntax

  user?: UserModel,
  loading: boolean,
  showIntroduction: boolean,
  timelineElement?: HTMLElement,
  timelineZero: number
}

export const useLookAtTime = defineStore("lookAtTime", {
  state: (): State => ({
    zoomLevel: 1_728_000_000_000,
    timeEvents: [],
    timeMarkers: [],
    timeMarkerDepth: 0,
    timelines: [],
    loading: true,
    showIntroduction: true,
    timelineZero: 0,
  }),

  getters: {
    readOnlyMode: (state) => state.selectedTimeline && !state.timelines.includes(state.selectedTimeline)
  },

  actions: {
    setTimeEvents(state, timeEvents: TimeEventModel[]) {
      timeEvents.sort((a, b) => a.date - b.date);
      state.timeEvents = timeEvents;
    },

    addTimeEvent(state, timeEvent: TimeEventModel) {
      state.timeEvents.push(timeEvent);
      state.timeEvents.sort((a, b) => a.date - b.date);
    },

    setTimelines(state, timelines: TimelineModel[]) {
      state.timelines = timelines;
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
    },

    async deleteTimeEvent(
      { state },
      timeEventId: string
    ): Promise<void> {
      await HttpClient.deleteTimeEvent(
        timeEventId,
        state.selectedTimeline.id,
        state.user.id
      )

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

    async createOrUpdateTimeEvent(
      { commit, state },
      changedTimeEvent: TimeEventModel
    ): Promise<void> {
      const timeEventWithImages = await HttpClient.createOrUpdateTimeEvent(
        changedTimeEvent,
        state.selectedTimeline.id,
        state.user.id
      );

      const index = state.timeEvents.findIndex(
        (timeEvent) => timeEvent.id === changedTimeEvent.id
      );
      if (index === -1) {
        state.timeEvents.push(timeEventWithImages);
        state.timeEvents.sort((a, b) => a.date - b.date);
      } else {
        state.timeEvents[index].title = timeEventWithImages.title;
        state.timeEvents[index].text = timeEventWithImages.text;
        state.timeEvents[index].date = timeEventWithImages.date;
        state.timeEvents[index].importance =
          timeEventWithImages.importance;
        state.timeEvents[index].imageReferences =
          timeEventWithImages.imageReferences;
      }
    },

    /**
     * Loads all time events for a given timeline.
     *
     * Sets loading true when starting and false after finished.
     */
    async loadTimeEvents(): Promise<void> {
      this.loading = true;
      ViewResetter.Instance.resetView();
      this.timeEvents = await HttpClient.getTimeEvents(this.selectedTimeline!.id);
      this.loading = false;
    },

    async setSelectedTimeline(timeline: TimelineModel): Promise<void> {
      this.selectedTimeline = timeline;

      SelectedTimelineLocalStorage.setSelectedTimelineId(timeline.id);
      this.loadTimeEvents();
    },

    async addTimeline(timeline: TimelineModel): Promise<void> {
      await HttpClient.createTimeline(timeline);
      this.timelines.push(timeline)
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
    async loadTimelines(): Promise<void> {
      const timelines = await HttpClient.getTimelines(this.user!.id);

      if (timelines.length > 0) {
        this.timelines = timelines;
      } else {
        this.addTimeline(new TimelineModel(uuid(), this.user!.id, "My timeline"))
      }

      // Case shared timeline
      const timelineIdQueryParam = new URLSearchParams(
        window.location.search
      ).get("timeline");

      if (timelineIdQueryParam && validUuid(timelineIdQueryParam)) {
        this.setSelectedTimeline(new TimelineModel(timelineIdQueryParam as string, "", "Shared timeline"))
      }

      // Case last selected timeline
      const timelineIndex = this.timelines.findIndex(
        (timeline) =>
          timeline.id === SelectedTimelineLocalStorage.getSelectedTimelineId()
      );

      if (timelineIndex !== -1) {
        this.setSelectedTimeline(this.timelines[timelineIndex]);
      }

      // Case fallback to first timeline
      this.setSelectedTimeline(this.timelines[0]);
    },

    /**
     * First loads the given user or creates a new one if no user
     * exists.
     *
     * Then loads timelines for user.
     *
     * Sets loading true when starting.
     */
    async loadUser(): Promise<void> {
      this.loading = true;

      const userId = UserLocalStorage.getUserId();

      let user: UserModel;
      try {
        user = await HttpClient.getUser(userId);
      } catch (e) {
        console.info("The specified user was not found. Recreating it...");
        user = { id: userId, name: "Time traveler" } as UserModel;
        await HttpClient.createUser(user);
      }

      this.user = user;
      this.loadTimelines();
    }
  },
});
