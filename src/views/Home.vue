<template>
  <div class="home">
    <div class="controls">
      <input v-model.number="date" type="number" />
      <input v-model.number="importance" type="number" />
      <button v-on:click="addBox(date, importance)">
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
import BoxCreator from "@/timeline/box-creator";

let boxCreator: BoxCreator;

export default Vue.extend({
  name: "Home",

  components: {
    Timeline
  },

  mounted() {
    boxCreator = BoxCreator.Instance;
    this.addBox(1804, 100);
  },

  data() {
    return {
      date: 1812,
      importance: 101
    };
  },
  methods: {
    addBox(date: number, importance: number) {
      const absolutePosition =
        store.state.timelineZero + date * store.state.zoomLevel;

      boxCreator.addBox(
        new BoxModel(
          absolutePosition,
          store.state.boxes.length,
          "text",
          date,
          importance
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
