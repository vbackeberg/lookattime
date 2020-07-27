<template>
  <div class="home" @mousewheel="onScroll">
    <div>
      <box v-for="box in boxes" v-bind:key="box.id" v-bind="box"></box>
    </div>
  </div>
</template>

<script lang="ts">
import Box from "@/components/Box.vue";
import store from "../store";
import Vue from "vue";
import { Constants } from "@/constants";
import BoxModel from "@/models/box-model";
import Repositioner from "@/timeline/repositioner";

export default Vue.extend({
  name: "Home",

  components: {
    Box,
  },

  created() {},

  data() {
    return {
      boxes: [
        new BoxModel(200, 200, 1),
        new BoxModel(500, 200, 2),
        new BoxModel(1500, 200, 3),
      ],
      zoomLevel: 1,
    };
  },

  computed: {
    lowestBox(): BoxModel {
      return this.boxes.reduce((previous, current) => {
        return previous.positionLeft < current.positionLeft
          ? previous
          : current;
      });
    },
  },

  methods: {
    onScroll(e: WheelEvent) {
      this.changeZoom(e);
    },

    changeZoom(e: WheelEvent) {
      if (e.deltaY < 0) {
        this.zoomIn(e);
      } else if (e.deltaY > 0) {
        this.zoomOut(e);
      } else {
        console.log("zoom level of " + this.zoomLevel + " exceeds limit.");
      }
    },

    zoomIn(e: WheelEvent) {
      this.zoomLevel += 0.1;
      Repositioner.reposition(this.boxes, this.lowestBox, 1.07, e.pageX);
    },

    zoomOut(e: WheelEvent) {
      this.zoomLevel -= 0.1;
      Repositioner.reposition(this.boxes, this.lowestBox, 0.92, e.pageX);
    },
  },
});
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  width: 100000px;
}
</style>
