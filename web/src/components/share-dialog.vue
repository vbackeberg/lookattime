<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title>
        Share your timeline
      </v-card-title>

      <v-card-text>
        <p>
          Everyone who receives this link will be able to view your timeline,
          but not edit it.
        </p>

        <v-text-field outlined filled readonly v-model="shareTimelineUrl"
          :append-icon="copied ? 'mdi-check' : 'mdi-content-copy'" @click:append="writeToClipboard()"></v-text-field>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="show = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useLookAtTime } from '@/store/store';
import { computed } from 'vue';
const store = useLookAtTime()
const emits = defineEmits({ show: Boolean })
const props = defineProps({ show: Boolean })

const show = computed({
  get: () => props.show,
  set: (value) => { emits("show", value); reset(value) }
})
let copied = false;

function shareTimelineUrl() {
  return `${window.location.origin}/?timeline=${store.selectedTimeline!.id}`
}

async function writeToClipboard() {
  await navigator.clipboard.writeText(shareTimelineUrl());
  copied = true;
}

function reset(value: boolean) {
  if (!value) {
    copied = false;
  }
}
</script>


