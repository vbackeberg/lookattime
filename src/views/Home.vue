<template>
  <div
    v-bind:style="{ width: this.timelineWidth, height: '100%' }"
    @mousewheel="onScroll"
  >
    <box v-for="box in boxes" v-bind:key="box.id" v-bind="box"></box>
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

  data() {
    return {
      boxes: [
        new BoxModel(200, 200, 1),
        new BoxModel(500, 200, 2),
        new BoxModel(1500, 200, 3),
      ]
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

    highestBox(): BoxModel {
      return this.boxes.reduce((previous, current) => {
        return previous.positionLeft > current.positionLeft
          ? previous
          : current;
      });
    },

    timelineWidth(): string {
      console.log(
        "width changing to: " +
          (this.highestBox.positionLeft + this.highestBox.width)
      );
      return this.highestBox.positionLeft + this.highestBox.width + "px";
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
      }
    },

    zoomIn(e: WheelEvent) {
      Repositioner.reposition(this.boxes, this.lowestBox, 1.07, e.pageX);
    },

    zoomOut(e: WheelEvent) {
      Repositioner.reposition(this.boxes, this.lowestBox, 0.92, e.pageX);
    },
  },
});
</script>

<style scoped lang="scss"></style>
