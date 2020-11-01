<template>
  <div
    class="connector zoom-transition zoomable"
    v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
  ></div>
</template>

<script lang="ts">
import BoxModel from "@/models/box-model";
import Vue from "vue";
export default Vue.extend({
  name: "Connector",

  props: {
    box: BoxModel
  },

  data() {
    return {
      width: 8
    };
  },

  computed: {
    positionLeft(): number {
      return this.box.positionCenter - this.width / 2;
    }
  }
});
</script>

<style scoped lang="scss">
.connector {
  height: 100%;
  position: absolute;

  background-color: #000;
}
</style>
