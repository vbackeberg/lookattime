<template>
  <div class="container-zoomable zoom-transition">
    <div class="buffer-top grow-transition"></div>
    <v-card
      class="content elevation-0 grow-transition"
      v-on:contextmenu.prevent="openContextMenu"
    >
      <v-img
        v-bind:src="previewImageSrc"
        class="card-image white--text align-end"
        alt="time event image"
      >
        <v-card-title class="card-title card-image-shadow">{{
          timeEvent.title
        }}</v-card-title>
        <v-card-subtitle class="card-title card-image-shadow">{{
          formattedDate
        }}</v-card-subtitle>
        <v-btn
          class="btn-full card-image-shadow"
          color="white"
          icon
          v-on:click.stop="openFullscreen()"
        >
          <v-icon>mdi-arrow-expand</v-icon>
        </v-btn>
      </v-img>
      <v-card-text class="card-text">{{ parsedText }}</v-card-text>
    </v-card>
    <svg class="connector grow-transition"></svg>
  </div>
</template>

<script lang="ts">
import { LOCALE } from "@/localization/locale";
import ImageReferenceModel from "@/models/image-reference-model";
import TimeEventModel from "@/models/time-event/time-event-model";
import ExpansionState from "@/models/time-event/expansion-state";
import store from "@/store/store";
import DateTimeFormatOptions from "@/timeline/date-time-format-options";
import { Temporal } from "@js-temporal/polyfill";
import Vue from "vue";
import { FullscreenToggled } from "./fullscreen/fullscreen-toggled";

/**
 * The variable card houses the three dynamic sizes of a time event
 * that change during zoom.
 */
export default Vue.extend({
  props: {
    id: String,
    imageReferences: Array,
    expansionZoomLevels: Array
  },

  data() {
    return {
      /**
       * Defines whether the time event should look like a box, bubble, dot or flat.
       */
      expansionState: ExpansionState.Flat
    };
  },

  mounted() {
    this.initializeHTMLElement();

    this.updateExpansionState();

    // TODO: Have only one global listener that calls update on all time events.
    document.addEventListener("update-expansion-states", () => {
      this.updateExpansionState();
    });
  },

  computed: {
    timeEvent(): TimeEventModel {
      // TODO: Consider replacing by find()
      const index = store.state.timeEvents.findIndex(
        timeEvent => timeEvent.id === this.id
      );

      if (index !== -1) {
        return store.state.timeEvents[index];
      } else {
        throw Error("Could not get time event index because it was not found");
      }
    },

    formattedDate(): string {
      return Temporal.Instant.fromEpochSeconds(
        this.timeEvent.date
      ).toLocaleString(LOCALE, {
        timeZone: Temporal.TimeZone.from(DateTimeFormatOptions.TIME_ZONE)
      });
    },

    previewImageSrc(): string {
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

    parsedText(): string {
      return (
        document.createRange().createContextualFragment(this.timeEvent.text)
          .textContent ?? ""
      );
    }
  },

  methods: {
    openContextMenu(e: MouseEvent) {
      this.$parent?.$emit("openContextMenu", e);
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
      this.timeEvent.zoomContainerHtmlElement = this.$el as HTMLElement;

      this.timeEvent.positionCenter = this.timeEvent.positionCenter;
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

    openFullscreen() {
      document.dispatchEvent(
        new CustomEvent<FullscreenToggled>("fullscreen-toggled", {
          detail: {
            timeEventId: this.id,
            isFullscreen: true,
            writeMode: false
          }
        })
      );
    },

    applyBoxStyles() {
      this.$el.classList.remove("bubble");
      this.$el.classList.remove("dot");
      this.$el.classList.add("box");
    },

    applyBubbleStyles() {
      this.$el.classList.remove("box");
      this.$el.classList.remove("dot");
      this.$el.classList.add("bubble");
    },

    applyDotStyles() {
      this.$el.classList.remove("box");
      this.$el.classList.remove("bubble");
      this.$el.classList.add("dot");
    }
  }
});
</script>

<style lang="scss" scoped>
@import "./time-event.scss";

$box-width: 300px;
$box-height: 400px;

// We resize the time event using scale instead of width/height to increase render performance.
$scale-factor-bubble-width: 0.2;
$scale-factor-bubble-height: $scale-factor-bubble-width *
  ($box-width / $box-height);
$scale-factor-dot-width: 0.05;
$scale-factor-dot-height: $scale-factor-dot-width / 2.5;

$distance-bubble-below-box: 72px;

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

.container-zoomable {
  position: relative;

  // TranslateX refers to the center of the element, so we position the
  // elements center at 0px by shifting it to the left by half its width.
  left: -$box-width / 2;
  width: $box-width;
  height: 100%;

  // This property reduces subtle vertical position shifting when translateX
  backface-visibility: hidden;
  pointer-events: none;
  content-visibility: auto;
  z-index: 5;

  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.content {
  width: $box-width;
  flex: 0 0 $box-height;
  pointer-events: auto;

  border-color: #aaa !important;
  border-style: solid;
  background-color: #fbfbfb;

  overflow: hidden;
  font-size: 0.875em;
  transform-origin: bottom;
}

.connector {
  flex: 1 0 auto;
  width: 2px;
  background-color: #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.date {
  margin-top: 8px;
}

.buffer-top {
  flex: 10 0 auto;
}

.buffer-bottom {
  flex: 0 0 200px;
}

.box {
  .buffer-top {
    height: 0;
  }

  .content {
    border-radius: 4px;
    border-width: $box-border-width;

    .card-image {
      max-height: 180px;
    }

    .card-text {
      flex-grow: 1;
      overflow-y: hidden;
      text-align: left;
    }
  }

  .connector {
    height: $distance-bubble-below-box;
  }
}

.bubble {
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
      height: 100%;
      transform: scaleY(
        $scale-factor-bubble-width / $scale-factor-bubble-height
      );

      .card-title {
        display: none;
      }
    }

    .btn-full {
      display: none;
    }

    .card-text {
      display: none;
    }
  }

  .connector {
    height: $connector-height;
  }
}

.dot {
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

.btn-full {
  position: absolute;
  top: 2px;
  right: 2px;
}
</style>
