<template>
  <div class="container-outer">
    <container-fullscreen
      v-bind:id="id"
      v-bind:writeModeE="writeMode"
      v-bind:imageReferences="[]"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ContainerFullscreen from "./fullscreen/container-fullscreen.vue";
export default Vue.extend({
  name: "TimeEventToBeCreated",
  components: {
    ContainerFullscreen
  },
  props: {
    id: String,
    imageReferences: Array,
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
