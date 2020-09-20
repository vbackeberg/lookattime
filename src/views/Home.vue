<template>
  <div class="home">
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
  name: "Home",

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

    return {
      boxes: boxes,
      spacerHighestBox: new SpacerModel(
        boxes[2].positionLeft + boxes[2].width,
        500,
        20,
        "#aa66ff"
      ),
      spacerPageEdge: new SpacerModel(0, 500, 40, "#22aaff")
    };
  },

  computed: {
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
      if (e.deltaY < 0) {
        Repositioner.zoomIn(
          this.boxes,
          this.lowestBox,
          1.07,
          e.pageX,
          this.spacerHighestBox,
          this.spacerPageEdge
        );
      } else if (e.deltaY > 0) {
        Repositioner.zoomOut(
          this.boxes,
          this.lowestBox,
          0.92,
          e.pageX,
          this.spacerHighestBox,
          this.spacerPageEdge
        );
      }
    }
  }
});
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  width: 100%;
}
</style>
