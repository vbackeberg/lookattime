<template>
  <div class="container-fullscreen">
    <div class="container-content elevation-20">
      <v-card class="content">
        <v-img
          v-bind:src="imageSources[0]"
          class="card-image white--text align-end"
          height="400px"
          alt="time event image"
        >
        </v-img>
        <div class="text-area">
          <div class="title-area">
            <div class="event-title">{{ title }}</div>
            <div class="event-subtitle">{{ formattedDate }}</div>
            <!-- TODO: Maybe, add relationships to other dates here. (like wikipedia tags below title) -->
          </div>
          <div class="columns">
            {{ text }}
            <div class="images">
              <div v-for="source in imageSources" v-bind:key="source.id">
                <v-img
                  v-bind:src="source"
                  class="card-image white--text align-end"
                  alt="time event image"
                  contain
                >
                </v-img>
                <v-card-text class="image-caption"
                  >This is a subtitle for above image</v-card-text
                >
              </div>
            </div>
          </div>
        </div>
        <v-btn
          class="btn-full card-image-shadow"
          color="white"
          icon
          v-on:click.stop="toggleFullscreen()"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card>
    </div>
  </div>
</template>
<script lang="ts">
import { LOCALE } from "@/localization/locale";
import ImageReferenceModel from "@/models/image-reference-model";
import DateTimeFormatOptions from "@/timeline/date-time-format-options";
import { Temporal } from "@js-temporal/polyfill";
import Vue from "vue";

/**
 * This fullscreen card is used for the fullscreen view of a time event.
 */
export default Vue.extend({
  props: {
    text: String,
    title: String,
    date: Number,
    importance: Number,
    imageReferences: Array
  },
  methods: {
    toggleFullscreen() {
      this.$emit("toggleFullscreen");
    }
  },

  computed: {
    imageSources(): string[] {
      if (this.imageReferences.length < 1) {
        return [];
      }

      return (this.imageReferences as ImageReferenceModel[]).map(
        imageReference =>
          process.env.VUE_APP_IMAGE_URL +
          imageReference.id +
          "." +
          imageReference.extension
      );
    },

    formattedDate(): string {
      return Temporal.Instant.fromEpochSeconds(this.date).toLocaleString(
        LOCALE,
        {
          timeZone: Temporal.TimeZone.from(DateTimeFormatOptions.TIME_ZONE)
        }
      );
    }
  }
});
</script>

<style lang="scss" scoped>
@import "./time-event.scss";

.container-fullscreen {
  position: fixed;
  width: 100%;
  height: 100vh;
  padding-bottom: 100px; // app bar height + footer height
  z-index: 6;
}

.container-content {
  height: 100%;
  width: 75%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  border-color: #aaa !important;
  border-style: solid;
  border-radius: 16px;
  border-width: $box-border-width;

  overflow: hidden;

  .content {
    height: 100%;
    width: 100%;

    overflow-y: scroll;

    display: flex;
    flex-direction: column;

    .btn-full {
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .text-area {
      padding: 32px;

      .title-area {
        margin-bottom: 32px;

        .event-title {
          font-size: 2.5rem;
          font-weight: 600;

          margin-bottom: 8px;
        }

        .event-subtitle {
          color: grey;
        }
      }

      .columns {
        padding: 0;
        text-align: justify;
        white-space: break-spaces;
        column-count: 2;

        .card-image {
          border-radius: 8px;
        }

        .image-caption {
          margin-bottom: 16px;
          text-align: center;
        }
      }
    }
  }
}
</style>
