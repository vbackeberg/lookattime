<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title class="headline justify-center">
        Pick a timeline or create a new one!
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-list v-model:selected="selectedTimelineIndex">
              <v-list-item v-for="timeline in store.timelines" :key="timeline.id" v-on:click="select(timeline)">
                {{ timeline.title }}
              </v-list-item>
              <v-list-item v-on:click="create()">
                Create new timeline</v-list-item>
          </v-list>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="text" @click.stop="back()">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { v4 as uuid } from "uuid"; // TODO do in backend
import { useLookAtTime } from "@/store/store";
import TimelineModel from "@/models/timeline-model";
import { computed } from 'vue';
const store = useLookAtTime()

const emits = defineEmits({ show: Boolean })
const props = defineProps({ show: Boolean })

const show = computed({
  get: () => props.show,
  set: (value) => emits("show", value)
})

const selectedTimelineIndex = computed(() => store.timelines.indexOf(store.selectedTimeline!))

async function select(timeline: TimelineModel) {
  if (store.selectedTimeline?.id != timeline.id) {
    await store.setSelectedTimeline(timeline);
  }

  show.value = false;
}

async function create() {
  show.value = false;

  const timeline = new TimelineModel(
    uuid(),
    store.user!.id,
    "Timeline"
  );

  await store.addTimeline(timeline);
  await store.setSelectedTimeline(timeline);
}

function back() {
  show.value = false;
}
</script>