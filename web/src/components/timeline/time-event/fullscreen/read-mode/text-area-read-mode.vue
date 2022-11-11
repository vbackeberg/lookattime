<template>
  <div class="text-area">
    <div class="title-area">
      <div class="event-title">{{ timeEvent.title }}</div>
      <div class="event-subtitle">{{ formattedDate }}</div>
      <!-- TODO: Maybe, add relationships to other dates here. (like wikipedia tags below title) -->
    </div>
    <editor-read-mode v-bind:value="timeEvent.text" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import EditorReadMode from "./editor-read-mode.vue";
import { LOCALE } from "@/localization/locale";
import DateTimeFormatOptions from "@/timeline/date-time-format-options";
import { Temporal } from "@js-temporal/polyfill";
import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";

export default Vue.extend({
  name: "TextAreaReadMode",
  components: { EditorReadMode },
  props: {
    id: String,
    value: Boolean
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

    formattedDate(): string {
      return Temporal.Instant.fromEpochSeconds(
        this.timeEvent.date
      ).toLocaleString(LOCALE, {
        timeZone: Temporal.TimeZone.from(DateTimeFormatOptions.TIME_ZONE)
      });
    }
  }
});
</script>

<style lang="scss" scoped>
@import "src/components/timeline/time-event/fullscreen/fullscreen.scss";
.event-title {
  margin-bottom: 26px; // Corresponds to v-text-field margins + details
}
</style>
