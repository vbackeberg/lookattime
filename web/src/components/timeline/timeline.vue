<template>
  <div id="timeline">
    <create-time-event-form
      v-model="showCreateTimeEventForm"
      v-bind:editMode="false"
    />
    <div id="buffer-top-area">
      <svg id="spacer-right" class="spacer"></svg>
      <svg id="spacer-left" class="spacer zoom-transition"></svg>
      <svg id="spacer-page-edge" class="spacer"></svg>
    </div>
    <div id="time-event-area">
      <time-event
        v-for="timeEvent in timeEventsVisible"
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
        v-for="timeEvent in timeEventsVisible"
        :key="timeEvent.id"
        v-bind:timeEvent="timeEvent"
      ></date>
      <timeMarker
        v-for="timeMarker in timeMarkersVisible"
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
        color="primary"
        @click.stop="showCreateTimeEventForm = true"
        ><v-icon>mdi-plus</v-icon></v-btn
      >
    </div>
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
import TimeMarkerDistanceWatcher from "@/timeline/time-marker-management/time-marker-distance-watcher";
import VisibilityObserver from "@/timeline/visibility-management/visibility-observer";
import CreateTimeEventForm from "@/components/timeline/create-time-event-form.vue";
import ZoomObserver from "@/timeline/zooming/zoom-observer";
import TimelineModel from "@/models/timeline-model";
import { mapGetters } from "vuex";
import SpacerModel from "@/models/spacer-model";
import TimeEventMutationObserver from "@/timeline/time-event-mutation-observer";

let timeMarkerDistanceWatcher: TimeMarkerDistanceWatcher;

export default Vue.extend({
  name: "Timeline",

  components: {
    TimeEvent,
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
    this.setHTMLElements();

    store.state.timelineZero = this.$el.clientWidth / 2;

    SpaceObserver.Instance;
    VisibilityObserver.Instance;
    ZoomObserver.Instance;
    TimeEventMutationObserver.Instance;

    // TODO: Check whether loading all content should go before loading the services.
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
    ...mapGetters([
      "timeEventsVisible",
      "timeMarkersVisible",
      "timeMarkerDistance",
      "viewMode"
    ]),

    horizontalLineWidth(): number {
      return Math.max(
        store.state.spacerPageEdge.positionLeft +
          store.state.spacerPageEdge.width,
        store.state.spacerRight.positionLeft + store.state.spacerRight.width
      );
    },

    loading(): boolean {
      return store.state.loading;
    }
  },

  methods: {
    setHTMLElements() {
      store.state.timelineElement = document.getElementById(
        "timeline"
      ) as HTMLElement;
      store.state.spacerRight.htmlElement = document.getElementById(
        "spacer-left"
      ) as HTMLElement;
      store.state.spacerLeft.htmlElement = document.getElementById(
        "spacer-right"
      ) as HTMLElement;
      store.state.spacerPageEdge.htmlElement = document.getElementById(
        "spacer-page-edge"
      ) as HTMLElement;
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

.spacer {
  box-sizing: border-box;
  position: absolute;
  height: 1px;
  width: 1px;
  transform-origin: left;
}
</style>
