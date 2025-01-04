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
              <template v-slot:activator="{ props }">
                <v-text-field v-model="plainDate" label="Date" prepend-icon="mdi-calendar" readonly v-bind="props.attrs"
                  v-on="props.on" :rules="[ruleNotEmpty]" :error-messages="errorMessageSameDate"></v-text-field>
              </template>
              <v-date-picker v-model="plainDate" @update:model-value="datePickerOpen = false"></v-date-picker>
            </v-menu>

            <v-btn small depressed fab color="grey lighten-4" class="mx-1 my-auto"
              @click.stop="timePickerVisible = !timePickerVisible">
              <v-icon>mdi-clock-time-four-outline</v-icon>
            </v-btn>

            <v-menu ref="menu" v-model="timePickerOpen" :close-on-content-click="false" :nudge-right="40"
              :return-value.sync="plainTime" transition="scale-transition" offset-y max-width="290px" min-width="290px">
              <template v-slot:activator="{ props }">
                <v-fade-transition>
                  <v-text-field v-model="plainTime" label="Time" readonly v-bind="props.attrs" v-on="props.on"
                    v-show="timePickerVisible"></v-text-field>
                </v-fade-transition>
              </template>
              <v-time-picker v-if="timePickerOpen" v-model="plainTime" use-seconds full-width
                @click:second="menu.save(plainTime)"></v-time-picker>
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
import { useLookAtTime } from "@/store/store";
import TemporalConversion from "@/temporal-extensions/temporal-conversion";
import DomPurify from "dompurify";
import { computed, ref, useTemplateRef } from "vue";
import type { FullscreenToggled } from "../fullscreen-toggled";
import EditorWriteMode from "./editor-write-mode.vue";
const store = useLookAtTime()
const props = defineProps({
  id: { type: String, required: true },
  show: Boolean
})
const menu = useTemplateRef("menu")

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
const datePickerOpen = ref(false);
const timePickerOpen = ref(false);
const timePickerVisible = ref(false);

// Form fields:
const plainDate = ref(null as null | string);
const plainTime = ref(null as null | string);
const title = ref(null as null | string);
const text = ref(null as null | string);
const importance = ref(null as null | number);

// Form state:
const valid = ref(true);
const loading = ref(false);

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
      TemporalConversion.epochSeconds(plainDate.value!, plainTime.value)
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
    title.value = timeEvent.title;
    text.value = timeEvent.text;
    importance.value = timeEvent.importance;
    plainDate.value = TemporalConversion.plainDate(timeEvent.date);
    plainTime.value = TemporalConversion.plainTime(timeEvent.date);
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
  loading.value = true;

  const date = TemporalConversion.epochSeconds(
    plainDate.value!,
    plainTime.value
  );

  try {
    await store.createOrUpdateTimeEvent(
      new TimeEventModel(
        props.id,
        DomPurify.sanitize(text.value!),
        date,
        importance.value!,
        [], // TODO: Obsolete, image urls are stored in text.
        title.value!
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

    show.value = false;
  } catch (e) {
    console.warn("Updating time event failed:", e);
    loading.value = false;
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
  show.value = false;

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