<template>
  <div class="px-4 py-4 flex flex-col justify-stretch h-full">
    <div class="flex gap-3 mb-4">
      <v-text-field id="event-title" class="flex-5" outlined full-width label="Title" required type="text"
        v-model="title" :rules="[ruleNotEmpty]" />
      <v-text-field class="flex-1" label="Importance" required type="number" v-model.number="importance" :rules="[
        ruleImportanceNoSame,
        ruleImportanceNoNegative,
        ruleNotEmpty
      ]" />
    </div>
    <div class="w-full flex align-center mb-4">
      <DatePicker v-model="plainDate" :show-time="timePickerVisible" :invalid="sameDateExists" />
      <Checkbox v-model="timePickerVisible" binary class="ms-2" /><span class="ms-1 text-sm">Show time</span>
    </div>
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
import TimeEventModel from "@/models/time-event/time-event-model";
import { useLookAtTime } from "@/store/store";
import DomPurify from "dompurify";
import { computed, ref } from "vue";
import type { FullscreenToggled } from "../fullscreen-toggled";
import EditorWriteMode from "./editor-write-mode.vue";
import DatePicker from 'primevue/datepicker';
import Checkbox from "primevue/checkbox";

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

const timePickerVisible = ref(false);

// Form fields:
const plainDate = ref(null as null | Date);
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
const sameDateExists = computed(() => (store.timeEvents
  .filter((timeEvent) => timeEvent.id != props.id)
  .map((timeEvent) => timeEvent.date)
  .includes(Math.floor(plainDate.value!.getTime() / 1000))
))

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
    plainDate.value = new Date(timeEvent.date * 1000);
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

  try {
    await store.createOrUpdateTimeEvent(
      new TimeEventModel(
        props.id,
        DomPurify.sanitize(text.value!),
        Math.floor(plainDate.value!.getTime() / 1000),
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