<template>
  <div class="container-outer grow-transition">
    <div class="container-zoomable zoom-transition zoomable">
      <div class="buffer-top grow-transition"></div>
      <v-card
        class="content elevation-0 grow-transition"
        v-on:contextmenu="openContextMenu"
      >
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
        v-bind:timeEvent="{
          id,
          text,
          date,
          importance,
          imageReferences,
          title
        }"
        v-bind:editMode="true"
      />
    </div>
    <div class="buffer-bottom grow-transition"></div>
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
import TimeEventModel from "@/models/time-event-model";

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
    timeEvent(): TimeEventModel {
      const index = store.state.timeEvents.findIndex(
        timeEvent => timeEvent.id === this.id
      );

      if (index !== -1) {
        return store.state.timeEvents[index];
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
     *  object so that we can access it for translateX modifications during the
     *  zoom.
     *
     *  We re-assign the position to trigger an initial translateX modification
     *  on the HTML element after it has been created.
     */
    initializeHTMLElement() {
      // TODO: This could be transformed into an event. Maybe there is already a vue event.
      this.timeEvent.zoomContainerHtmlElement = this.$el
        .children[0] as HTMLElement;

      this.timeEvent.positionCenter = this.timeEvent.positionCenter;
    },

    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
      FullscreenEventTarget.Instance.dispatchEvent(
        new CustomEvent("fullscreen-toggled", {
          detail: { isFullscreen: this.isFullscreen }
        })
      );
      this.isFullscreen
        ? this.applyFullscreenStyles()
        : this.removeFullscreenStyles();
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

    /**
     * Sets `fullscreen` class that holds respective styles.
     * Centers the element by applying `translateX` on the `container-outer`
     * and removing `transform` on the `container-zoomable`.
     */
    applyFullscreenStyles() {
      this.$el.classList.remove("box");
      this.$el.classList.remove("bubble");
      this.$el.classList.remove("dot");
      this.$el.classList.add("fullscreen");

      const el = this.$el.getElementsByClassName(
        "container-zoomable"
      )[0] as HTMLElement;
      el.style.removeProperty("transform");

      (this.$el as HTMLElement).style.transform =
        "translateX(" + store.state.timelineElement.scrollLeft + "px)";
    },

    /**
     * Sets `box` class that holds respective styles.
     * Moves element back to original position by removing `transform` on `container-outer`
     * and applying `positionCenter` on the `container-zoomable`.
     *
     */
    removeFullscreenStyles() {
      (this.$el as HTMLElement).style.removeProperty("transform");
      this.timeEvent.positionCenter = this.timeEvent.positionCenter;
      this.applyBoxStyles();
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
$box-width: 300px;
$box-height: 400px;
$box-border-width: 1px;

// We resize the time event using scale instead of width/height to increase render performance.
$scale-factor-bubble-width: 0.2;
$scale-factor-bubble-height: $scale-factor-bubble-width *
  ($box-width / $box-height);
$scale-factor-dot-width: 0.05;
$scale-factor-dot-height: $scale-factor-dot-width / 2.5;

$distance-bubble-below-box: 72px;

.container-outer {
  height: 100%;
  position: absolute;
  display: flex;
  flex-flow: column nowrap;
}

.buffer-bottom {
  flex: 1 0 64px;
}

.container-zoomable {
  position: relative;

  // TranslateX refers to the center of the element, so we position the
  // elements center at 0px by shifting it to the left by half its width.
  left: -$box-width / 2;
  width: $box-width;
  flex: 5 0 auto;

  // This property reduces subtle vertical position shifting when translateX
  backface-visibility: hidden;
  pointer-events: none;
  content-visibility: auto;

  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.buffer-top {
  flex: 16 0 auto;
}

/**
 * Applies transition to the element.
 * 
 * We only allow transitions on the "transform" property to make sure
 * browser only runs high-performance "composite" step
 * and not "paint" and "layout".
 */
.grow-transition {
  transition-property: transform;
  transition-duration: var(--transition-duration);
  transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
}

.content {
  width: $box-width;
  flex: 0 0 $box-height;
  pointer-events: auto;

  background-color: #fff;
  border-color: #aaa;
  border-style: solid;

  overflow: hidden;
  font-size: 0.875em;
  transform-origin: bottom;

  display: flex;
  flex-direction: column;
}

.connector {
  flex: 1 0 auto;
  width: 2px;
  background-color: #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.btn-full {
  position: absolute;
  top: 2px;
  right: 2px;
}

.box {
  // TODO move buffer top out of container zoomable
  .container-zoomable {
    .buffer-top {
      height: 0;
    }

    .content {
      border-radius: 4px;
      border-width: $box-border-width;

      .card-image {
        height: 40%;
        min-height: 50px;
        max-height: 200px;

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

    .connector {
      height: $distance-bubble-below-box;
    }
  }
}

.bubble {
  .container-zoomable {
    $connector-height: 8px;

    .buffer-top {
      height: $distance-bubble-below-box - $connector-height;
    }

    .content {
      transform: scale($scale-factor-bubble-width, $scale-factor-bubble-height);

      border-width: $box-border-width / $scale-factor-bubble-height
        $box-border-width / $scale-factor-bubble-width;
      border-radius: 50%;
      .card-image {
        transform: scaleY(
          $scale-factor-bubble-width / $scale-factor-bubble-height
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

    .connector {
      height: $connector-height;
    }
  }
}

.dot {
  .container-zoomable {
    .buffer-top {
      height: $distance-bubble-below-box;
    }

    .content {
      transform: scale($scale-factor-dot-width, $scale-factor-dot-height);

      border-radius: 50% 50% 0 0 / 100% 100% 0 0;
      border-bottom: 0;
      background-color: #000;
    }

    .card-image {
      display: none;
    }

    .card-text {
      display: none;
    }

    .connector {
      flex: 0 0 0;
    }
  }
}

.fullscreen {
  width: 100%;
  z-index: 9;

  .container-zoomable {
    left: 0px;
    width: 75%;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;

    .buffer-top {
      flex: 0 0 0;
    }

    .content {
      flex: 1 0 0;
      width: 100%;

      border-radius: 4px;
      border-width: $box-border-width;

      .card-image {
        height: 40%;
        min-height: 50px;
        max-height: 200px;

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

    .connector {
      flex: 0 0 0;
    }

    .date {
      visibility: hidden;
    }
  }

  .buffer-bottom {
    flex: 0 0 0;
  }
}
</style>
