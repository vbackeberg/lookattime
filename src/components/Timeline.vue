<template>
  <div id="timeline">
    <box v-for="box in boxes" v-bind:key="box.id" v-bind="box"></box>
    <spacer v-bind="spacerHighestBox"></spacer>
    <spacer v-bind="spacerPageEdge"></spacer>
    <div
      class="timelineZero"
      v-bind:style="{ left: timelineZero + 'px' }"
    ></div>
  </div>
</template>

<script lang="ts">
import Box from "@/components/Box.vue";
import Vue from "vue";
import BoxModel from "@/models/box-model";
import SpacerModel from "@/models/spacer-model";
import Spacer from "@/components/Spacer.vue";
import repositioner from "@/timeline/repositioner-instance";
import store from "@/store";

export default Vue.extend({
  name: "Timeline",

  components: {
    Box,
    Spacer
  },

  created() {
    window.addEventListener("wheel", (e: WheelEvent) => {
      this.changeZoom(e);
    });

    store.commit("addBox", new BoxModel(500, 200, store.state.boxes.length));
    store.commit("setSpacerHighestBox", new SpacerModel(500, 200, 10, "#f3a"));
    store.commit("setSpacerPageEdge", new SpacerModel(500, 200, 20, "#afa"));
    store.commit("setTimelineZero", window.innerWidth / 2);
  },

  computed: {
    boxes(): BoxModel[] {
      return store.state.boxes;
    },

    spacerHighestBox(): SpacerModel {
      return store.state.spacerHighestBox;
    },

    spacerPageEdge(): SpacerModel {
      return store.state.spacerPageEdge;
    },

    timelineZero(): number {
      return store.state.timelineZero;
    }
  },

  methods: {
    changeZoom(e: WheelEvent) {
      const element = this.$el;

      if (e.deltaY < 0) {
        repositioner.zoomIn(1.07, e.pageX + element.scrollLeft);
      } else if (e.deltaY > 0) {
        repositioner.zoomOut(0.92, e.pageX + element.scrollLeft);
      }
    }
  }
});
</script>

<style scoped lang="scss">
#timeline {
  flex: 1;
  width: 100%;
  background-color: #ffa;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: scroll;
  position: relative;
}

.timelineZero {
  height: 50px;
  width: 50px;
  background-color: #35b;
  position: absolute;
}
</style>
