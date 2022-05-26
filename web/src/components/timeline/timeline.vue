<template>
  <div id="timeline">
    <create-time-event-form
      v-model="showCreateTimeEventForm"
      v-bind:editMode="false"
    />
    <div id="buffer-top-area">
      <svg id="spacer-right" class="spacer"></svg>
      <svg id="spacer-left" class="spacer zoom-transition"></svg>
      <svg id="spacer-viewport-right" class="spacer"></svg>
    </div>
    <div id="time-event-area">
      <time-event
        v-for="timeEvent in timeEvents"
        v-bind:key="timeEvent.id"
        v-bind:id="timeEvent.id"
        v-bind:text="timeEvent.text"
        v-bind:title="timeEvent.title"
        v-bind:date="timeEvent.date"
        v-bind:importance="timeEvent.importance"
        v-bind:imageReferences="timeEvent.imageReferences"
        v-bind:expansionZoomLevels="timeEvent.expansionZoomLevels"
      ></time-event>
    </div>
    <v-btn
      v-if="!viewMode"
      id="fab"
      fab
      large
      fixed
      right
      bottom
      color="primary"
      @click.stop="showCreateTimeEventForm = true"
      ><v-icon>mdi-plus</v-icon></v-btn
    >
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import TimeEvent from "@/components/timeline/time-event/time-event.vue";
import Vue from "vue";
import store from "@/store/store";
import SpaceObserver from "@/timeline/space-management/space-observer";
import CreateTimeEventForm from "@/components/timeline/create-time-event-form.vue";
import ZoomObserver from "@/timeline/zooming/zoom-observer";
import TimelineModel from "@/models/timeline-model";
import { mapGetters } from "vuex";
import ViewFocusTrigger from "@/timeline/viewport/view-focus-trigger";
import TimeEventModel from "@/models/time-event-model";
import TimeMarkerDistanceObserver from "@/timeline/time-marker-management/time-marker-distance-observer";
import Spacer from "@/models/spacer";
import CollisionCalculationTrigger from "@/timeline/collision/collision-calculation-trigger";

export default Vue.extend({
  name: "Timeline",

  components: {
    TimeEvent,
    CreateTimeEventForm
  },

  data() {
    return {
      showCreateTimeEventForm: false
    };
  },

  created() {
    store.commit("setLoading", true);
  },

  async mounted() {
    this.setHTMLElements();
    this.setSpacers();

    store.state.timelineZero = this.$el.clientWidth / 2;

    this.initializeTimelineServices();

    await store.dispatch("loadUser");

    const timelineIdQueryParam = this.$route.query?.timeline;
    if (timelineIdQueryParam) {
      await store.dispatch(
        "setSelectedTimeline",
        new TimelineModel(timelineIdQueryParam as string, "", "Shared timeline")
      );
    }

    store.commit("setLoading", false);
  },

  computed: {
    ...mapGetters(["viewMode"]),

    horizontalLineWidth(): number {
      return Math.max(
        store.state.spacerViewportRight.positionLeft +
          store.state.spacerViewportRight.width,
        store.state.spacerRight.positionLeft + store.state.spacerRight.width
      );
    },

    loading(): boolean {
      return store.state.loading;
    },

    timeEvents(): TimeEventModel[] {
      return store.state.timeEvents;
    }
  },

  methods: {
    setHTMLElements() {
      store.state.timelineElement = document.getElementById(
        "timeline"
      ) as HTMLElement;
    },

    setSpacers() {
      store.state.spacerViewportRight = new Spacer(
        0,
        1,
        "spacer-viewport-right"
      );
      store.state.spacerLeft = new Spacer(0, 1, "spacer-left");
      store.state.spacerRight = new Spacer(0, 1, "spacer-right");
    },

    initializeTimelineServices() {
      SpaceObserver.Instance;
      ZoomObserver.Instance;
      // TODO: Reactivate time markers as soon as calculation works on year, month, day, etc. level.
      // TimeMarkerDistanceObserver.Instance;
      ViewFocusTrigger.Instance;
      CollisionCalculationTrigger.Instance;
    }
  }
});
</script>

<style scoped lang="scss">
#timeline {
  flex: 1;
  width: 100%;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: scroll;
  position: relative;
  background-color: #fff;

  display: flex;
  flex-flow: column nowrap;
}

#time-event-area {
  flex: 4 0 200px;

  position: relative;
}

#horizontal-line {
  flex: 0 0 8px;

  background-color: #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#fab {
  margin-bottom: 64px;
  margin-right: 64px;
}

.spacer {
  box-sizing: border-box;
  position: absolute;
  height: 1px;
  width: 1px;
  transform-origin: left;
}
</style>
