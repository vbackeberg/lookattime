<template>
  <div class="zoom-container zoom-transition zoomable">
    <div class="buffer-top grow-transition"></div>
    <div class="content grow-transition">
      <v-card class="card" v-on:contextmenu="openContextMenu">
        <v-img
          v-bind:src="imageSource"
          class="card-image white--text align-end"
          alt="time event image"
        >
          <v-card-title class="card-title card-image-shadow">{{
            title
          }}</v-card-title>
          <v-btn
            class="btn-full card-image-shadow"
            color="white"
            icon
            v-on:click.stop="toggleFullscreen()"
          >
            <v-icon>mdi-arrow-expand</v-icon>
          </v-btn>
        </v-img>
        <v-card-text class="card-text">{{ text }}</v-card-text>
      </v-card>
    </div>
    <svg class="connector grow-transition"></svg>
    <div class="date">{{ formattedDate }}</div>
    <v-menu
      v-model="showContextMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      style="max-width: 600px"
    >
      <v-list>
        <v-list-item v-on:click.stop="showCreateTimeEventForm = true">
          <v-list-item-title>Edit</v-list-item-title>
        </v-list-item>
        <v-list-item v-on:click.stop="deleteEvent()">
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <create-time-event-form
      v-model="showCreateTimeEventForm"
      v-bind:timeEvent="{ id, text, date, importance, imageReferences, title }"
      v-bind:editMode="true"
    />
  </div>
</template>

<script lang="ts">
import CreateTimeEventForm from "@/components/timeline/create-time-event-form.vue";
import ImageReferenceModel from "@/models/image-reference-model";
import store from "@/store/store";
import { Temporal } from "@js-temporal/polyfill";
import Vue from "vue";
import FullscreenEventTarget from "@/timeline/fullscreen-event-target";
import ExpansionState from "@/models/time-event/expansion-state";
import { Constants } from "@/timeline/zooming/constants";

export default Vue.extend({
  name: "TimeEvent",

  components: {
    CreateTimeEventForm
  },

  props: {
    id: String,
    text: String,
    date: Number,
    importance: Number,
    imageReferences: Array,
    title: String,
    expansionZoomLevels: Array
  },

  mounted() {
    this.initializeHTMLElement();

    document.addEventListener("update-expansion-states", () => {
      this.updateExpansionState();
    });
  },

  data() {
    return {
      showContextMenu: false,
      x: 0,
      y: 0,

      showCreateTimeEventForm: false,

      /**
       * Defines whether the time event should look like a box, bubble, dot or flat.
       */
      expansionState: ExpansionState.Flat,
      isFullscreen: false,
      expansionClass: "dot"
    };
  },

  computed: {
    timeEventIndex(): number {
      const index = store.state.timeEvents.findIndex(
        timeEvent => timeEvent.id === this.id
      );

      if (index !== -1) {
        return index;
      } else {
        throw Error("Could not get time event index because it was not found");
      }
    },

    imageSource(): string {
      if (this.imageReferences.length < 1) {
        return "";
      }

      const imageReference = this.imageReferences[0] as ImageReferenceModel;

      return (
        process.env.VUE_APP_IMAGE_URL +
        imageReference.id +
        "." +
        imageReference.extension
      );
    },

    formattedDate(): string {
      return Temporal.Instant.fromEpochSeconds(this.date).toLocaleString();
    }
  },

  methods: {
    openContextMenu(e: MouseEvent) {
      e.preventDefault();
      this.showContextMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showContextMenu = true;
      });
    },

    deleteEvent() {
      store.dispatch("deleteTimeEvent", this.id);
    },

    /**
     *  After the HTML element has been created, we tie it to the time event
     *  object so that we can access it for style modifications during the
     *  zoom.
     *
     *  We re-assign the position to trigger an initial translateX modification
     *  on the HTML element after it has been created.
     */
    initializeHTMLElement() {
      store.state.timeEvents[this.timeEventIndex].htmlElement = <HTMLElement>(
        this.$el
      );

      store.state.timeEvents[this.timeEventIndex].positionCenter =
        store.state.timeEvents[this.timeEventIndex].positionCenter;
    },

    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
      FullscreenEventTarget.Instance.dispatchEvent(
        new CustomEvent("fullscreen-toggled", {
          detail: { isFullscreen: this.isFullscreen }
        })
      );
      this.applyFullscreenStyles();
    },

    /**
     * Sets the expansion state according to the current zoom level.
     * The index in expansion zoom levels represents a specific
     * expansion state via the enums integer value.
     *
     * Then applies the appropriate CSS class. For performance reasons
     * we do not change the class through class binding.
     */
    updateExpansionState() {
      const newExpansionState = (this
        .expansionZoomLevels as number[]).findIndex(
        zoomLevel => store.state.zoomLevel <= zoomLevel
      );

      if (newExpansionState !== this.expansionState) {
        switch (newExpansionState) {
          case ExpansionState.Box:
            this.applyBoxStyles();
            break;

          case ExpansionState.Bubble:
            this.applyBubbleStyles();
            break;

          default:
            this.applyDotStyles();
            break;
        }

        this.expansionState = newExpansionState;
      }
    },

    applyFullscreenStyles() {
      // TODO: To preserve animation, consider using a separate
      // fullscreen repositioner that listens to `fullscreen-toggled`
      // and repositions the time event accordingly.

      const el = this.$el as HTMLElement;
      el.parentElement?.parentElement?.appendChild(el);

      const left = el.getBoundingClientRect().left;
      const top = el.getBoundingClientRect().top;
      console.log("left: " + left, "top: " + top);
      el.classList.remove("zoom-transition");
      el.style.position = "fixed";
      el.style.transform = "translateX(" + left + "px)";

      el.classList.add("zoom-transition");

      this.$el.classList.remove("box");
      this.$el.classList.remove("bubble");
      this.$el.classList.remove("dot");
      // this.$el.classList.add("fullscreen");
      // el.style.removeProperty("transform");
    },

    applyBoxStyles() {
      this.$el.classList.remove("fullscreen");
      this.$el.classList.remove("bubble");
      this.$el.classList.remove("dot");
      this.$el.classList.add("box");
    },

    applyBubbleStyles() {
      this.$el.classList.remove("fullscreen");
      this.$el.classList.remove("box");
      this.$el.classList.remove("dot");
      this.$el.classList.add("bubble");
    },

    applyDotStyles() {
      this.$el.classList.remove("fullscreen");
      this.$el.classList.remove("box");
      this.$el.classList.remove("bubble");
      this.$el.classList.add("dot");
    }
  }
});
</script>

<style scoped lang="scss">
$base-width: 300px;
$base-height: 150px;
$base-border-width: 1px;

// We resize the time event using scale instead of width/height to increase render performance.
$scale-factor-bubble-width: 0.2;
$scale-factor-bubble-height: $scale-factor-bubble-width *
  ($base-width / $base-height);
$scale-factor-dot-width: 0.05;

.zoom-container {
  position: absolute;

  // TranslateX refers to the center of the element, so we position the
  // elements center at 0px by shifting it to the left by half its width.
  left: -$base-width / 2;
  width: $base-width;
  height: 100%;

  // This property reduces subtle vertical position shifting when translateX
  backface-visibility: hidden;
  pointer-events: none;
  content-visibility: auto;

  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.grow-transition {
  transition-property: transform, flex;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
}

.content {
  width: $base-width;
  height: $base-height;
  background-color: #fff;
  border-color: #aaa;
  border-style: solid;

  overflow: hidden;
  font-size: 0.875em;
  transform-origin: bottom;
}

.card {
  height: 100%;
  pointer-events: auto;

  display: flex;
  flex-direction: column;
}

.connector {
  height: 100%;
  width: 2px;
  background-color: #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.box {
  .buffer-top {
    flex: 0 1 auto;
  }

  .content {
    flex: 5 1 50px;

    border-radius: 4px;
    border-width: $base-border-width;

    .card {
      .card-image {
        height: 40%;
        min-height: 50px;
        max-height: 200px;

        .btn-full {
          position: absolute;
          top: 2px;
          right: 2px;
        }

        .card-image-shadow {
          text-shadow: 0px 0px 3px #000;
        }
      }

      .card-text {
        flex-grow: 1;
        overflow-y: auto;
        text-align: left;
      }
    }
  }

  .connector {
    flex: 1 0 2px;
  }
}

.bubble {
  .buffer-top {
    flex: 16 0 auto;
  }

  .content {
    flex: 0 0 auto;

    transform: scale($scale-factor-bubble-width, $scale-factor-bubble-height);
    border-width: $base-border-width / $scale-factor-bubble-height
      $base-border-width / $scale-factor-bubble-width;
    border-radius: 50%;

    .card {
      .card-image {
        transform: scaleX(
          $scale-factor-bubble-height / $scale-factor-bubble-width
        );

        .card-title {
          display: none;
        }

        .btn-full {
          display: none;
        }
      }

      .card-text {
        display: none;
      }
    }
  }

  .connector {
    flex: 1 0 2px;
  }
}

.dot {
  .buffer-top {
    flex: 16 0 auto;
  }

  .content {
    flex: 0 0 auto;

    transform: scale($scale-factor-dot-width);

    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    border-bottom: 0;
    background-color: #000;

    .card {
      display: none;
    }
  }

  .connector {
    flex: 0 0 0;
  }
}

.fullscreen {
  left: 10%;
  width: 80%;
  height: 90%;
  z-index: 9;

  .content {
    flex: 1 0 auto;
    width: 100%;

    border-radius: 4px;
    border-width: $base-border-width;
  }

  .buffer-top {
    display: none;
  }

  .connector {
    display: none;
  }

  .date {
    display: none;
  }
}
</style>
