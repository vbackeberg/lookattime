<template>
  <div class="container-outer">
    <container-fullscreen
      v-if="isFullscreen"
      v-bind:imageReferences="timeEvent.imageReferences"
      v-bind:text="text"
      v-bind:title="title"
      v-bind:date="date"
      v-on:toggleFullscreen="toggleFullscreen()"
    />
    <container-zoomable
      v-else
      v-bind:id="id"
      v-bind:text="text"
      v-bind:title="title"
      v-bind:date="date"
      v-bind:importance="importance"
      v-bind:imageReferences="timeEvent.imageReferences"
      v-bind:expansionZoomLevels="expansionZoomLevels"
      v-on:toggleFullscreen="toggleFullscreen()"
    />
  </div>
</template>

<script lang="ts">
import store from "@/store/store";
import Vue from "vue";
import ContainerFullscreen from "./container-fullscreen.vue";
import ContainerZoomable from "./container-zoomable.vue";
import TimeEventModel from "@/models/time-event-model";

export default Vue.extend({
  name: "TimeEvent",

  components: {
    ContainerFullscreen,
    ContainerZoomable
  },

  props: {
    id: String,
    text: String,
    date: Number,
    importance: Number,
    imageReferences: Array,
    title: String,
    expansionZoomLevels: Array
  },

  data() {
    return {
      isFullscreen: false
    };
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
    }
  },

  methods: {
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
      document.dispatchEvent(
        new CustomEvent("fullscreen-toggled", {
          detail: { isFullscreen: this.isFullscreen }
        })
      );
    }
  }
});
</script>

<style scoped lang="scss">
.container-outer {
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
}
</style>
