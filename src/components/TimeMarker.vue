<template>
  <transition>
    <div
      class="marker zoom-transition zoomable"
      v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
    >
      {{ date }}
    </div>
  </transition>
</template>

<script lang="ts">
import TimeMarkerModel from "@/models/time-marker-model";
import Vue from "vue";

export default Vue.extend({
  name: "TimeMarker",

  data() {
    return {
      width: TimeMarkerModel.width,
      widthOffset: TimeMarkerModel.width / 2
    };
  },

  props: {
    positionCenter: Number,
    id: String,
    date: Number
  },

  computed: {
    positionLeft(): number {
      return this.positionCenter - this.widthOffset;
    }
  }
});
</script>

<style scoped lang="scss">
.marker {
  position: absolute;
  height: 16px;
  background-color: brown;
}
</style>
