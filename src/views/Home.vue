<template>
  <div class="home">
    <div class="controls">
      <input v-model.number="relativePosition" type="number" />
      <button v-on:click="addBox(relativePosition)">
        Add new
      </button>
    </div>
    <timeline></timeline>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Timeline from "@/components/Timeline.vue";
import BoxModel from "@/models/box-model";
import store from "@/store";
import repositioner from "@/timeline/repositioner";

export default Vue.extend({
  name: "Home",

  components: {
    Timeline
  },

  data() {
    return {
      relativePosition: 100
    };
  },

  methods: {
    addBox(relativePosition: number) {
      const absolutePosition =
        store.state.timelineZero + relativePosition * store.state.zoomLevel;

      store.commit(
        "addBox",
        new BoxModel(absolutePosition, 200, store.state.boxes.length)
      );

      repositioner.extendLeftSpaceOnInsert();
    }
  }
});
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
}
.controls {
  height: 50px;
  width: 100%;
}
</style>
