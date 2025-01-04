<template>
  <div class="container-outer">
    <ContainerFullscreen v-bind:id="props.id" v-bind:writeModeE="props.writeMode" v-bind:imageReferences="[]" />
  </div>
</template>

<script setup lang="ts">
import ContainerFullscreen from './fullscreen/container-fullscreen.vue';

const props = defineProps({
  id: { type: String, required: true },
  imageReferences: { type: Array, required: true },
  writeMode: { type: Boolean, required: true }
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
