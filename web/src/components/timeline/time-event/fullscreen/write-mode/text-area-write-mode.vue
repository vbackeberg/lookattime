<template>
  <div id="text-area">
    <v-form v-model="valid" ref="form">
      <div id="title-area">
        <!-- title and importance -->
        <v-row>
          <v-col cols="10">
            <v-text-field id="event-title" class="flex-grow-3" outlined full-width label="Title" required type="text"
              v-model="title" :rules="[ruleNotEmpty]" />
          </v-col>
          <v-col cols="2">
            <v-text-field class="flex-grow-1" label="Importance" required type="number" v-model.number="importance"
              :rules="[
                ruleImportanceNoSame,
                ruleImportanceNoNegative,
                ruleNotEmpty
              ]" />
          </v-col>
        </v-row>
        <!-- date and time picker -->
        <v-row>
          <div class="d-flex">
            <v-menu v-model="datePickerOpen" :close-on-content-click="false" :nudge-right="40"
              transition="scale-transition" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="plainDate" label="Date" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                  v-on="on" :rules="[ruleNotEmpty]" :error-messages="errorMessageSameDate"></v-text-field>
              </template>
              <v-date-picker v-model="plainDate" @input="datePickerOpen = false"></v-date-picker>
            </v-menu>

            <v-btn small depressed fab color="grey lighten-4" class="mx-1 my-auto"
              @click.stop="timePickerVisible = !timePickerVisible">
              <v-icon>mdi-clock-time-four-outline</v-icon>
            </v-btn>

            <v-menu ref="menu" v-model="timePickerOpen" :close-on-content-click="false" :nudge-right="40"
              :return-value.sync="plainTime" transition="scale-transition" offset-y max-width="290px" min-width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-fade-transition>
                  <v-text-field v-model="plainTime" label="Time" readonly v-bind="attrs" v-on="on"
                    v-show="timePickerVisible"></v-text-field>
                </v-fade-transition>
              </template>
              <v-time-picker v-if="timePickerOpen" v-model="plainTime" use-seconds full-width
                @click:second="$refs.menu.save(plainTime)"></v-time-picker>
            </v-menu>
          </div>
        </v-row>
        <!-- TODO: Maybe, add relationships to other dates here. (like wikipedia tags below title) -->
      </div>
    </v-form>

    <editor-write-mode v-model="text" v-bind:id="id" />

    <div class="mt-2 d-flex justify-end">
      <v-btn color="secondary" class="me-2" variant="text" @click.stop="cancel()">
        Cancel
      </v-btn>
      <v-btn id="text-area-btn-save" :disabled="!valid || loading" color="primary"
        @click.stop="submit()"><v-progress-circular indeterminate size="24" v-if="loading"></v-progress-circular>
        Save
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import TimeEventModel from "@/models/time-event/time-event-model";
import TemporalConversion from "@/temporal-extensions/temporal-conversion";
import EditorWriteMode from "./editor-write-mode.vue";
import DomPurify from "dompurify";
import { useLookAtTime } from "@/store/store";
import { computed } from "vue";
import type { FullscreenToggled } from "../fullscreen-toggled";
const store = useLookAtTime()
const props = defineProps({
  id: { type: String, required: true },
  show: Boolean
})

// Form validation rules:
const ruleImportanceNoSame = (v: number) =>
  !store.timeEvents
    .filter((timeEvent) => timeEvent.id != props.id)
    .map((timeEvent) => timeEvent.importance)
    .includes(Number(v)) ||
  "You have another time event with the same importance level. Please pick a different level!";

const ruleImportanceNoNegative = (v: number) =>
  v > 0 || "Importance must be a number above 0.";

const ruleNotEmpty = (v: string) => !!v || "This field is required.";

// Date picker state:
let datePickerOpen = false;
let timePickerOpen = false;
let timePickerVisible = false;

// Form fields:
let plainDate = null as null | string;
let plainTime = null as null | string;
let title = null as null | string;
let text = null as null | string;
let importance = null as null | number;

// Form state:
let valid = true;
let loading = false;

if (props.id !== null) {
  populateForm();
}

const emits = defineEmits({ show: Boolean })

const show = computed({
  get: () => props.show,
  set: (value) => emits("show", value)
})
const errorMessageSameDate = computed(() => {
  return store.timeEvents
    .filter((timeEvent) => timeEvent.id != props.id)
    .map((timeEvent) => timeEvent.date)
    .includes(
      TemporalConversion.epochSeconds(plainDate!, plainTime)
    )
    ? ["You have another event at this date!"]
    : [];
})

function populateForm() {
  const timeEvent = store.timeEvents
    .concat(
      store.timeEventToBeCreated
        ? [store.timeEventToBeCreated]
        : []
    )
    .find((timeEvent) => timeEvent.id === props.id);

  if (!timeEvent) {
    throw Error("Could not get time event because it was not found");
  } else {
    title = timeEvent.title;
    text = timeEvent.text;
    importance = timeEvent.importance;
    plainDate = TemporalConversion.plainDate(timeEvent.date);
    plainTime = TemporalConversion.plainTime(timeEvent.date);
  }
}

// TODO: User may upload images and then hit cancel.
// This will lead to images being created and not used.
// Consider even sending an update call when cancelling
// or purge non-used images.

/**
 * Submits an update or creation of a time event.
 *
 * All non-null asserted calls are secured by form validation rules.
 */
async function submit() {
  loading = true;

  const date = TemporalConversion.epochSeconds(
    plainDate!,
    plainTime
  );

  try {
    await store.createOrUpdateTimeEvent(
      new TimeEventModel(
        props.id,
        DomPurify.sanitize(text!),
        date,
        importance!,
        [], // TODO: Obsolete, image urls are stored in text.
        title!
      ))

    if (store.timeEventToBeCreated) {
      store.setTimeEventToBeCreated(undefined);

      document.dispatchEvent(
        new CustomEvent<FullscreenToggled>("fullscreen-toggled", {
          detail: {
            timeEventId: props.id,
            isFullscreen: false,
            writeMode: false
          }
        })
      );
    }

    props.show = false;
  } catch (e) {
    console.warn("Updating time event failed:", e);
    loading = false;
  }
}

// TODO: Consider asking before closing to avoid data loss
// Alternatively, store data

/**
 * Switches back to read mode.
 *
 * If the time event has not been created, yet, cancel will discard
 * the time event and close fullscreen mode.
 */
async function cancel() {
  props.show = false;

  if (store.timeEventToBeCreated) {
    store.setTimeEventToBeCreated(undefined);

    document.dispatchEvent(
      new CustomEvent<FullscreenToggled>("fullscreen-toggled", {
        detail: {
          timeEventId: props.id,
          isFullscreen: false,
          writeMode: false
        }
      })
    );
  }
}
</script>

<style lang="scss" scoped>
@import "src/components/timeline/time-event/fullscreen/fullscreen.scss";
</style>
