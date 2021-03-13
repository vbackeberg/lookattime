<template>
  <div id="timeline">
    <create-time-event-form v-model="showCreateTimeEventForm" />
    <div id="buffer-top-area">
      <spacer v-bind="spacerRight"></spacer>
      <spacer-left ref="spacerLeftElement" v-bind="spacerLeft"></spacer-left>
      <spacer v-bind="spacerPageEdge"></spacer>
    </div>
    <div id="time-event-area">
      <time-event
        v-for="timeEvent in timeEvents"
        :key="timeEvent.id"
        v-bind="timeEvent"
      ></time-event>
    </div>
    <div
      id="horizontal-line"
      v-bind:style="{ width: horizontalLineWidth + 'px' }"
    ></div>
    <div id="buffer-bottom-area">
      <date
        v-for="timeEvent in timeEvents"
        :key="timeEvent.id"
        v-bind:timeEvent="timeEvent"
      ></date>
      <timeMarker
        v-for="timeMarker in timeMarkers"
        v-bind="timeMarker"
        :key="timeMarker.id"
      ></timeMarker>
      <v-btn
        v-if="!viewMode"
        id="fab"
        fab
        large
        fixed
        right
        color="accent"
        @click.stop="showCreateTimeEventForm = true"
        ><v-icon>mdi-plus</v-icon></v-btn
      >
    </div>
    <v-overlay :value="loading" :absolute="true">
      <div id="loading-overlay-content">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <span id="loading-overlay-text">
          <br />
          Please bear with us as we spin up our database. <br />
          This may take up to a few minutes...</span
        >
      </div></v-overlay
    >
  </div>
</template>

<script lang="ts">
import TimeEvent from "@/components/timeline/time-event/time-event.vue";
import Vue from "vue";
import TimeEventModel from "@/models/time-event-model";
import SpacerModel from "@/models/spacer-model";
import Spacer from "@/components/timeline/spacer/spacer.vue";
import SpacerLeft from "@/components/timeline/spacer/spacer-left.vue";
import store from "@/store/store";
import Date from "@/components/timeline/time-event/date.vue";
import TimeMarkerModel from "@/models/time-marker-model";
import TimeMarker from "@/components/timeline/time-marker.vue";
import SpaceObserver from "@/timeline/space-management/space-observer";
import TimeMarkerDistanceWatcher from "@/timeline/time-marker-management/time-marker-distance-watcher";
import VisibilityObserver from "@/timeline/visibility-management/visibility-observer";
import CreateTimeEventForm from "@/components/timeline/create-time-event-form.vue";
import ZoomObserver from "@/timeline/zooming/zoom-observer";
import TimelineModel from "@/models/timeline-model";

let timeMarkerDistanceWatcher: TimeMarkerDistanceWatcher;

export default Vue.extend({
  name: "Timeline",

  components: {
    TimeEvent,
    Spacer,
    SpacerLeft,
    Date,
    TimeMarker,
    CreateTimeEventForm
  },

  data() {
    return { showCreateTimeEventForm: false };
  },

  created() {
    store.commit("setLoading", true);
  },

  async mounted() {
    store.state.timelineElement = document.getElementById(
      "timeline"
    ) as HTMLElement;

    store.commit("setTimelineZero", this.$el.clientWidth / 2);

    SpaceObserver.Instance;
    timeMarkerDistanceWatcher = TimeMarkerDistanceWatcher.Instance;
    VisibilityObserver.Instance;
    ZoomObserver.Instance;

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
    spacerRight(): SpacerModel {
      return store.getters.spacerRight;
    },

    spacerLeft(): SpacerModel {
      return store.getters.spacerLeft;
    },

    spacerPageEdge(): SpacerModel {
      return store.state.spacerPageEdge;
    },

    horizontalLineWidth(): number {
      return Math.max(
        store.state.spacerPageEdge.positionLeft +
          store.state.spacerPageEdge.width,
        this.spacerRight.positionLeft + this.spacerRight.width
      );
    },

    timeEvents(): TimeEventModel[] {
      return store.getters.timeEventsVisible;
    },

    timeMarkers(): TimeMarkerModel[] {
      return store.getters.timeMarkersVisible;
    },

    timeMarkerDistance(): number {
      return store.getters.timeMarkerDistance;
    },

    viewMode(): boolean {
      return store.getters.viewMode;
    },

    loading(): boolean {
      return store.state.loading;
    }
  },

  watch: {
    timeMarkerDistance(newDistance, oldDistance) {
      timeMarkerDistanceWatcher.watch(newDistance, oldDistance);
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

#buffer-top-area {
  flex: 2 0 20px;
}

#time-event-area {
  flex: 4 0 200px;

  position: relative; // TODO check if still needed
}

#horizontal-line {
  flex: 0 0 8px;

  background-color: #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#buffer-bottom-area {
  flex: 4; // TODO check if position relative is needed
}

#fab {
  margin-top: 64px;
  margin-right: 64px;
}

#loading-overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#loading-overlay-text {
  animation: loading-overlay-text-fadein 500ms ease 3s;
  animation-fill-mode: backwards;
  text-align: center;
}

@keyframes loading-overlay-text-fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
