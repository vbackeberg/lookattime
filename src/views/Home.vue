<template>
  <div class="home">
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
    Box
  },

  created() {
    window.addEventListener("wheel", (e: WheelEvent) => {
      this.changeZoom(e);
    });
  },

  data() {
    return {
      boxes: [
        new BoxModel(200, 200, 1),
        new BoxModel(500, 200, 2),
        new BoxModel(1500, 200, 3)
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
    }
  },

  methods: {
    changeZoom(e: WheelEvent) {
      if (e.deltaY < 0) {
        Repositioner.zoomIn(this.boxes, this.lowestBox, 1.07, e.pageX);
      } else if (e.deltaY > 0) {
        Repositioner.zoomOut(this.boxes, this.lowestBox, 0.92, e.pageX);
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
