<template>
  <transition>
    <div
      class="marker zoom-transition zoomable"
      v-bind:style="[styleWidth, styleTranslate]"
    ></div>
  </transition>
</template>

<script lang="ts">
import TimeMarkerModel from "@/models/time-marker-model";
import Vue from "vue";

export default Vue.extend({
  name: "TimeMarker",

  props: {
    positionCenter: Number,
    id: String,
    date: Number
  },

  data() {
    return {
      styleWidth: {
        width: TimeMarkerModel.width + "px"
      }
    };
  },

  computed: {
    styleTranslate(): object {
      return {
        transform:
          "translateX(" +
          (this.positionCenter - TimeMarkerModel.widthOffset) +
          "px)"
      };
    }
  }
});
</script>

<style scoped lang="scss">
.marker {
  position: absolute;
  height: 12px;
  background-color: #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
