<template>
  <div class="home">
    <div class="controls">
      <input v-model.number="date" type="number" />
      <button v-on:click="addBox(date)">
        Add new
      </button>
    </div>
    <timeline ref="timelineElement"></timeline>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Timeline from "@/components/Timeline.vue";
import BoxModel from "@/models/box-model";
import store from "@/store";

export default Vue.extend({
  name: "Home",

  components: {
    Timeline
  },

  data() {
    return {
      date: 1812
    };
  },
  methods: {
    addBox(date: number) {
      const absolutePosition =
        store.state.timelineZero + date * store.state.zoomLevel;

      store.commit(
        "addBox",
        new BoxModel(
          absolutePosition,
          300,
          store.state.boxes.length,
          "text",
          date
        )
      );
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
