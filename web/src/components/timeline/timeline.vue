<template>
  <div id="timeline">
    <create-time-event-form
      v-model="showCreateTimeEventForm"
      v-bind:editMode="false"
    />
    <div id="buffer-top-area">
      <svg id="spacer-right" class="spacer"></svg>
      <svg id="spacer-left" class="spacer zoomable zoom-transition"></svg>
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
      <transition name="fade">
        <svg v-if="timeEvents.length > 0" id="horizontal-line"></svg>
      </transition>
    </div>
    <!-- TODO: When depth below years, show year as a big number underneath -->
    <div id="time-marker-area"></div>
    <v-btn
      v-if="!readOnlyMode"
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
import Spacer from "@/models/spacer";
import CollisionCalculationTrigger from "@/timeline/collision/collision-calculation-trigger";
import TimeMarkerDepthObserver from "@/timeline/time-marker-management/time-marker-depth-observer";

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

    await this.setSelectedTimeline();

    this.observeAndRepositionHorizontalLine();

    store.commit("setLoading", false);
  },

  computed: {
    ...mapGetters(["readOnlyMode"]),

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

    async setSelectedTimeline() {
      const timelineIdQueryParam = this.$route.query?.timeline;
      if (timelineIdQueryParam) {
        await store.dispatch(
          "setSelectedTimeline",
          new TimelineModel(
            timelineIdQueryParam as string,
            "",
            "Shared timeline"
          )
        );
      }
    },

    initializeTimelineServices() {
      SpaceObserver.Instance;
      ZoomObserver.Instance;
      ViewFocusTrigger.Instance;
      CollisionCalculationTrigger.Instance;
      TimeMarkerDepthObserver.Instance;
    },

    reloadPage() {
      location.href = location.href;
    },

    /**
     * Initially repositions horizontal line once and then repositions
     * whenever window resizes or the number of children within
     * `time-event-area` (the time events) changes.
     */
    observeAndRepositionHorizontalLine() {
      this.repositionHorizontalLine();

      window.onresize = _ => {
        this.repositionHorizontalLine();
      };

      new MutationObserver(() => {
        this.repositionHorizontalLine();
      }).observe(document.getElementById("time-event-area") as HTMLElement, {
        childList: true
      });
    },

    /**
     * Anchor horizontal line to top of `time-marker-area` element.
     *
     * The horizontal line is a special element in the application
     * because it is bound to two different constraints. On the one hand
     * it needs to cover the range from the viewports left to right edge,
     * regardless of the timelines actual width - this is why it has to be
     * a fixed element. On the other hand it needs to be positioned right
     * between the time events `connector` and `date` elements to make them
     * appear as emerging from the timeline. This is why its vertical
     * position must be set in a programmatical way.
     *
     * Both elements are guaranteed to exist since this method is called
     * after component has been mounted.
     */
    repositionHorizontalLine() {
      const anchorElement = document.getElementById(
        "time-marker-area"
      ) as HTMLElement;

      const horizontalLineElement = document.getElementById(
        "horizontal-line"
      ) as HTMLElement;

      horizontalLineElement.style.top = `${anchorElement.getBoundingClientRect()
        .top - horizontalLineElement.getBoundingClientRect().height}px`;
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

#horizontal-line {
  width: 100%;
  height: 4px;
  position: fixed;

  background-color: #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
