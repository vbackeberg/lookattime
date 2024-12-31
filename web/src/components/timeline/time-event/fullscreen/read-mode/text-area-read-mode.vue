<template>
  <div id="text-area">
    <div id="title-area">
      <div id="event-title">{{ timeEvent.title }}</div>
      <div id="event-subtitle">{{ formattedDate }}</div>
      <!-- TODO: Maybe, add relationships to other dates here. (like wikipedia tags below title) -->
    </div>
    <editor-read-mode v-bind:value="timeEvent.text" />
  </div>
</template>

<script setup lang="ts">
import EditorReadMode from "./editor-read-mode.vue";
import { LOCALE } from "@/localization/locale";
import DateTimeFormatOptions from "@/timeline/date-time-format-options";
import { Temporal } from "@js-temporal/polyfill";
import { useLookAtTime } from "@/store/store";
import { computed } from "vue";

const store = useLookAtTime()

const props = defineProps({
  id: String,
  value: Boolean
})

const timeEvent = computed(() => {
  const timeEvent = store.timeEvents.find(
    timeEvent => timeEvent.id === props.id
  );

  if (timeEvent) return timeEvent;
  else throw Error("Could not get time event because it was not found");
})

const formattedDate = computed(() => {
  return Temporal.Instant.fromEpochSeconds(
    timeEvent.value.date
  ).toLocaleString(LOCALE, {
    timeZone: Temporal.TimeZone.from(DateTimeFormatOptions.TIME_ZONE)
  });
})
</script>

<style lang="css" scoped>
.event-title {
  margin-bottom: 26px; /* Corresponds to v-text-field margins + details */
}
</style>
