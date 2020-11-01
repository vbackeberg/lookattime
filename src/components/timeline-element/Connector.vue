<template>
  <div
    class="connector zoom-transition"
    v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
  ></div>
</template>

<script lang="ts">
import store from "@/store";
import Vue from "vue";
export default Vue.extend({
  name: "Connector",

  props: {
    boxId: Number
  },

  data() {
    return {
      width: 8
    };
  },

  computed: {
    positionLeft(): number {
      const box = store.state.boxes[this.boxId];

      return box.positionCenter - this.width / 2;
    }
  }
});
</script>

<style scoped lang="scss">
.connector {
  height: 100%;
  position: absolute;
}
</style>
