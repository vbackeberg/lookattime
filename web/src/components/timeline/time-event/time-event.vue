<template>
  <div class="container-outer">
    <container-fullscreen v-if="isFullscreen" :id :writeModeE="props.writeMode" />
    <container-zoomable v-else :id :imageReferences :positionCenter :date :text :expansionZoomLevels
      v-on:openContextMenu="(e: MouseEvent, el: HTMLDivElement) => $emit('openContextMenu', e, el)" />
  </div>
</template>

<script setup lang="ts">
import ContainerFullscreen from "./fullscreen/container-fullscreen.vue";
import ContainerZoomable from "./container-zoomable.vue";
import ImageReferenceModel from "@/models/image-reference-model";

const props = defineProps<{
  id: string,
  imageReferences: ImageReferenceModel[],
  isFullscreen: boolean,
  writeMode: boolean,
  positionCenter: number
  date: number, text: string, expansionZoomLevels: number[]
}>()
</script>

<style scoped lang="css">
.container-outer {
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
}
</style>
