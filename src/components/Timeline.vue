<template>
  <div id="timeline">
    <box v-for="box in boxes" v-bind:key="box.id" v-bind="box"></box>
    <spacer v-bind="spacerHighestBox"></spacer>
    <spacer v-bind="spacerPageEdge"></spacer>
  </div>
</template>

<script lang="ts">
import Box from "@/components/Box.vue";
import Vue from "vue";
import BoxModel from "@/models/box-model";
import Repositioner from "@/timeline/repositioner";
import SpacerModel from "@/models/spacer-model";
import Spacer from "@/components/Spacer.vue";

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
  },

  data() {
    const boxes = [
      new BoxModel(0, 200, 1),
      new BoxModel(500, 200, 2),
      new BoxModel(1500, 200, 3)
    ];

    const highestBox = boxes[boxes.length - 1];

    return {
      boxes: boxes,

      spacerHighestBox: new SpacerModel(
        highestBox.positionLeft + highestBox.width,
        500,
        10,
        "#f3a"
      ),

      spacerPageEdge: new SpacerModel(0, 500, 20, "#afa")
    };
  },

  computed: {
    //TODO: If boxes was refactored to be sorted from lowest to highest, use first (lowest) element of array here.
    lowestBox(): BoxModel {
      return this.boxes.reduce((previous, current) => {
        return previous.positionLeft < current.positionLeft
          ? previous
          : current;
      });
    }
  },

  methods: {
    changeZoom(e: WheelEvent) {
      const element = this.$el;

      if (e.deltaY < 0) {
        Repositioner.zoomIn(
          this.boxes,
          this.lowestBox,
          1.07,
          e.pageX + element.scrollLeft,
          this.spacerHighestBox,
          this.spacerPageEdge
        );
      } else if (e.deltaY > 0) {
        Repositioner.zoomOut(
          this.boxes,
          this.lowestBox,
          0.92,
          e.pageX + element.scrollLeft,
          this.spacerHighestBox,
          this.spacerPageEdge
        );
      }
    }
  }
});
</script>

<style scoped lang="scss">
#timeline {
  height: 60%;
  width: 100%;
  background-color: #ffa;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: scroll;
  position: relative;
}
</style>
