<template>
  <div id="fullscreen-container">
    <div id="fullscreen-container-content" class="elevation-20">
      <v-card id="fullscreen-content">
        <div class="buttons-top-right">
          <v-btn v-if="!store.readOnlyMode" class="" :class="{ 'btn-dark': writeMode }" icon
            :disabled="isTimeEventToBeCreated"
            v-on:click.stop="writeMode = !writeMode"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn class="" icon v-on:click.stop="closeFullscreen()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <text-area-write-mode v-if="writeMode" v-model="writeMode" v-bind:id="id" />
        <text-area-read-mode v-if="!writeMode" v-model="writeMode" v-bind:id="id" />
      </v-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useLookAtTime } from "@/store/store";
import type { FullscreenToggled } from "./fullscreen-toggled";
import { computed } from "vue";

const store = useLookAtTime()

/**
 * This fullscreen card is used for the fullscreen view of a time event.
 */
const props = defineProps({
  id: { type: String, required: true },
  writeModeE: Boolean
})

let writeMode = false

function closeFullscreen() {
  if (store.timeEventToBeCreated) {
    store.setTimeEventToBeCreated(undefined);
  }

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

writeMode = props.writeModeE;

const isTimeEventToBeCreated = computed(() => {
  return store.timeEventToBeCreated !== null;
})
</script>

<style lang="css" scoped>
#fullscreen-container {
  position: fixed;
  width: 100%;
  height: 100vh;
  padding-bottom: 100px; /* app bar height + footer height */
  z-index: 6;
}

#fullscreen-container-content {
  height: 100%;
  width: 75%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  border-color: #aaa !important;
  border-style: solid;
  border-radius: 16px;
  border-width: var(--box-border-width);

  overflow: hidden;
}

#fullscreen-content {
  height: 100%;
  width: 100%;

  overflow-y: scroll;

  display: flex;
  flex-direction: column;
}

.buttons-top-right {
  display: flex;
  justify-content: end;
  padding: 8px;
  gap: 4px;
}

.btn-dark {
  background-color: var(--lat-primary-color)dd;
}
</style>
