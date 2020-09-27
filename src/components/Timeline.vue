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

  props: {
    pboxes: Array
  },

  computed: {
    boxes(): BoxModel[] {
      const boxes = this.pboxes as BoxModel[];
      boxes.sort((a, b) => a.positionLeft - b.positionLeft);
      return boxes;
    },

    lowestBox(): BoxModel {
      return this.boxes[0];
    },

    highestBox(): BoxModel {
      return this.boxes[this.boxes.length - 1];
    },

    spacerHighestBox(): SpacerModel {
      return new SpacerModel(
        this.highestBox.positionLeft + this.highestBox.width,
        500,
        10,
        "#f3a"
      );
    },

    spacerPageEdge(): SpacerModel {
      return new SpacerModel(0, 500, 20, "#afa");
    }
  },

  methods: {
    changeZoom(e: WheelEvent) {
      const element = this.$el;

      if (e.deltaY < 0) {
        Repositioner.zoomIn(
          this.boxes,
          this.lowestBox,
          this.highestBox,
          1.07,
          e.pageX + element.scrollLeft,
          this.spacerHighestBox,
          this.spacerPageEdge
        );
      } else if (e.deltaY > 0) {
        Repositioner.zoomOut(
          this.boxes,
          this.lowestBox,
          this.highestBox,
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
  flex: 1;
  width: 100%;
  background-color: #ffa;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: scroll;
  position: relative;
}
</style>
