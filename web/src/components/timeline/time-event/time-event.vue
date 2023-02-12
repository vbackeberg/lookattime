<template>
  <div class="container-outer">
    <container-fullscreen
      v-if="isFullscreen"
      v-bind:id="id"
      v-bind:writeModeE="writeMode"
    />
    <container-zoomable
      v-else
      v-bind:id="id"
      v-bind:imageReferences="imageReferences"
      v-bind:expansionZoomLevels="expansionZoomLevels"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ContainerFullscreen from "./fullscreen/container-fullscreen.vue";
import ContainerZoomable from "./container-zoomable.vue";

export default Vue.extend({
  name: "TimeEvent",

  components: {
    ContainerFullscreen,
    ContainerZoomable
  },

  props: {
    id: String,
    imageReferences: Array,
    expansionZoomLevels: Array,
    isFullscreen: Boolean,
    writeMode: Boolean
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
