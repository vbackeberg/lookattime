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
      <transition-group name="time-markers">
        <timeMarker
          v-for="timeMarker in timeMarkers"
          v-bind="timeMarker"
          :key="timeMarker.id"
        ></timeMarker>
      </transition-group>
      <v-btn
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
  </div>
</template>

<script lang="ts">
import TimeEvent from "@/components/timeline/time-event/time-event.vue";
import Vue from "vue";
import TimeEventModel from "@/models/time-event-model";
import SpacerModel from "@/models/spacer-model";
import Spacer from "@/components/timeline/spacer/spacer.vue";
import SpacerLeft from "@/components/timeline/spacer/spacer-left.vue";
import store from "@/store";
import Date from "@/components/timeline/time-event/date.vue";
import TimeMarkerModel from "@/models/time-marker-model";
import TimeMarker from "@/components/timeline/time-marker.vue";
import SpaceObserver from "@/timeline/space-management/space-observer";
import TimeMarkerWatcher from "@/timeline/time-marker-management/time-marker-watcher";
import ScrollObserver from "@/timeline/visibility-management/scroll-observer";
import CreateTimeEventForm from "@/components/timeline/create-time-event-form.vue";
import ZoomObserver from "@/timeline/zooming/zoom-observer";
import ViewFocuser from "@/timeline/view-focuser";

let timeMarkerWatcher: TimeMarkerWatcher;

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

  mounted() {
    store.state.timelineElement = document.getElementById(
      "timeline"
    ) as HTMLElement;

    store.commit("setTimelineZero", this.$el.clientWidth / 2);

    SpaceObserver.Instance;
    timeMarkerWatcher = TimeMarkerWatcher.Instance;
    ScrollObserver.Instance;
    ZoomObserver.Instance;

    this.loadTimeEvents();
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
    }
  },

  methods: {
    async loadTimeEvents() {
      await store.dispatch("loadTimeEvents");

      if (store.state.timeEvents.length === 1) {
        ViewFocuser.Instance.focusOnTimeEvent(store.state.timeEvents[0]);
      } else if (store.state.timeEvents.length > 1) {
        ViewFocuser.Instance.focusOnRange(
          store.state.timeEvents[0].date,
          store.state.timeEvents[store.state.timeEvents.length - 1].date
        );
      }
    }
  },

  watch: {
    timeMarkerDistance(newDistance, oldDistance) {
      timeMarkerWatcher.watch(newDistance, oldDistance);
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
  overflow-x: auto;
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

  position: relative;
}

#horizontal-line {
  flex: 0 0 8px;

  background-color: #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#buffer-bottom-area {
  flex: 4;
}

#fab {
  margin-top: 64px;
  margin-right: 64px;
}

.time-markers-enter-active,
.time-markers-leave-active {
  transition: opacity 300ms ease-in-out;
}

.time-markers-enter,
.time-markers-leave-to {
  opacity: 0;
}
</style>
