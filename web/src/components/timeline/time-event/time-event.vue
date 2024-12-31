<template>
  <div class="container-outer">
    <container-fullscreen v-if="isFullscreen" v-bind:id="id" v-bind:writeModeE="writeMode" />
    <container-zoomable v-else v-bind:id="id" v-bind:imageReferences
      v-bind:expansionZoomLevels />
  </div>
</template>

<script setup lang="ts">
import ContainerFullscreen from "./fullscreen/container-fullscreen.vue";
import ContainerZoomable from "./container-zoomable.vue";
import ExpansionState from "@/models/time-event/expansion-state";
import ImageReferenceModel from "@/models/image-reference-model";

const props = defineProps({
  id: String,
  imageReferences: Array<ImageReferenceModel>,
  expansionZoomLevels: Array<ExpansionState>,
  isFullscreen: Boolean,
  writeMode: Boolean
})
</script>

<style scoped lang="css">
.container-outer {
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
}
</style>
