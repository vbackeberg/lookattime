<template>
  <div class="container-outer">
    <container-fullscreen v-bind:id="id" v-bind:writeModeE="writeMode" v-bind:imageReferences="[]" />
  </div>
</template>

<script setup lang="ts">
import ContainerFullscreen from "./fullscreen/container-fullscreen.vue";
const props = defineProps({
  id: String,
  imageReferences: Array,
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
