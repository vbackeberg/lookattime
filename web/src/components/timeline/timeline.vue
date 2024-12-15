<template>
  <div id="timeline">
    <div id="buffer-top-area">
      <!-- space management listens to this zoom-transition -->
      <svg id="spacer-left" class="spacer zoom-transition"></svg>
      <svg id="spacer-right" class="spacer"></svg>
      <svg id="spacer-viewport-right" class="spacer"></svg>
    </div>
    <div id="time-event-area">
      <time-event
        v-for="timeEvent in timeEvents"
        v-bind:key="timeEvent.id"
        v-bind:id="timeEvent.id"
        v-bind:imageReferences="timeEvent.imageReferences"
        v-bind:isFullscreen="timeEvent.isFullscreen"
        v-bind:writeMode="timeEvent.writeMode"
        v-on:openContextMenu="openContextMenu($event, timeEvent.id)"
      ></time-event>
      <time-event-to-be-created
        v-if="timeEventToBeCreated"
        v-bind:id="timeEventToBeCreated.id"
        v-bind:imageReferences="timeEventToBeCreated.imageReferences"
        v-bind:writeMode="true"
      ></time-event-to-be-created>
      <horizontal-line></horizontal-line>
    </div>
    <!-- TODO: When depth below years, show year as a big number underneath -->
    <div id="time-marker-area"></div>
    <v-tooltip top v-if="!readOnlyMode" transition="fade-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          id="fab"
          fab
          large
          fixed
          right
          bottom
          color="primary"
          @click.stop="createNewTimeEvent"
          v-bind="attrs"
          v-on="on"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </template>
      <span>Add new time event</span>
    </v-tooltip>
    <v-overlay :value="loading">
      <div class="loading-container">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <p class="loading-text fadeIn delay3s">
          Please wait while we are spinning up our database...
        </p>
        <v-btn
          rounded
          color="error"
          class="fadeIn delay8s"
          @click.stop="reloadPage()"
          >refresh now</v-btn
        >
      </div>
    </v-overlay>

    <v-menu
      v-model="showContextMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      style="max-width: 600px"
    >
      <v-list>
        <v-list-item v-on:click.stop="deleteEvent()">
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import TimeEvent from "@/components/timeline/time-event/time-event.vue";
import Vue from "vue";
import store from "@/store/store";
import SpaceObserver from "@/timeline/space-management/space-observer";
import ZoomObserver from "@/timeline/zooming/zoom-observer";
import { mapGetters } from "vuex";
import ViewFocusTrigger from "@/timeline/viewport/view-focus-trigger";
import TimeEventModel from "@/models/time-event/time-event-model";
import Spacer from "@/models/spacer";
import CollisionCalculationTrigger from "@/timeline/collision/collision-calculation-trigger";
import TimeMarkerRecreationTrigger from "@/timeline/time-marker-management/time-marker-recreation-trigger";
import HorizontalLine from "@/components/timeline/horizontal-line.vue";
import { v4 as uuid } from "uuid";
import { Temporal } from "@js-temporal/polyfill";
import { FullscreenToggled } from "@/components/timeline/time-event/fullscreen/fullscreen-toggled";
import TimeEventToBeCreated from "./time-event/time-event-to-be-created.vue";

export default Vue.extend({
  name: "Timeline",

  components: {
    TimeEvent,
    HorizontalLine,
    TimeEventToBeCreated
  },

  data() {
    return {
      isFullscreen: false,

      showContextMenu: false,
      x: 0,
      y: 0,

      selectedTimeEventId: null as string | null
    };
  },

  async mounted() {
    this.setHTMLElements();
    this.setSpacers();

    store.state.timelineZero = this.$el.clientWidth / 2;

    this.initializeTimelineServices();

    await store.dispatch("loadUser");

    document.addEventListener("fullscreen-toggled", (e) => {
      const event = e as CustomEvent<FullscreenToggled>;
      const index = this.timeEvents.findIndex(
        (timeEvent) => timeEvent.id == event.detail.timeEventId
      );

      if (index !== -1) {
        this.timeEvents[index].isFullscreen = event.detail.isFullscreen;
        this.timeEvents[index].writeMode = event.detail.writeMode;
      }
    });
  },

  computed: {
    ...mapGetters(["readOnlyMode"]),

    loading(): boolean {
      return store.state.loading;
    },

    timeEvents(): TimeEventModel[] {
      return store.state.timeEvents;
    },

    timeEventToBeCreated(): TimeEventModel | null {
      return store.state.timeEventToBeCreated;
    }
  },

  methods: {
    openContextMenu(e: MouseEvent, timeEventId: string) {
      this.selectedTimeEventId = timeEventId;

      this.showContextMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showContextMenu = true;
      });
    },

    createNewTimeEvent() {
      const date = Temporal.Now.instant().epochSeconds;
      const timeEventToBeCreated = new TimeEventModel(
        uuid(),
        "",
        date,
        0, // TODO Shouldn't be set when creating. Maybe make 0 or -1 a reserved value for not set.
        [],
        ""
      );

      store.commit("setTimeEventToBeCreated", timeEventToBeCreated);

      document.dispatchEvent(
        new CustomEvent<FullscreenToggled>("fullscreen-toggled", {
          detail: {
            timeEventId: timeEventToBeCreated.id,
            isFullscreen: true,
            writeMode: true
          }
        })
      );
    },

    deleteEvent() {
      if (this.selectedTimeEventId) {
        store.dispatch("deleteTimeEvent", this.selectedTimeEventId);
      }
      this.showContextMenu = false;
    },

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
      ViewFocusTrigger.Instance;
      CollisionCalculationTrigger.Instance;
      TimeMarkerRecreationTrigger.Instance;
    },

    reloadPage() {
      location.href = location.href;
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
  flex: 5 0 200px;

  position: relative;
}

#time-marker-area {
  flex: 1 0 16px;

  position: relative;
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

.loading-container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  .loading-text {
    font-size: 1.2rem;
    margin-top: 64px;
  }

  .fadeIn {
    opacity: 0;
    visibility: hidden;
    animation-duration: 300ms;
    animation-fill-mode: forwards;
    animation-name: fadeIn;
  }

  .delay3s {
    animation-delay: 3s;
  }

  .delay8s {
    animation-delay: 8s;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      visibility: visible;
    }
    to {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
