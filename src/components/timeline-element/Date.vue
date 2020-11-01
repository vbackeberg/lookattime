<template>
  <div
    class="date zoom-transition"
    v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
  >
    1782
  </div>
</template>

<script lang="ts">
import BoxModel from "@/models/box-model";
import Vue from "vue";
export default Vue.extend({
  name: "Date",

  props: {
    box: BoxModel
  },

  computed: {
    positionLeft(): number {
      return this.box.positionCenter - this.box.width / 2;
    },

    width(): number {
      return this.box.width;
    }
  }
});
</script>

<style scoped lang="scss">
.date {
  position: absolute;
  vertical-align: top;

  text-align: center;
}
</style>
