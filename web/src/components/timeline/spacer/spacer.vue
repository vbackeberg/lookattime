<template>
  <div class="spacer" v-bind:style="[styleWidth, styleTranslate]"></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Spacer",

  props: {
    positionLeft: Number,
    width: Number
  },

  computed: {
    styleWidth(): object {
      return {
        width: this.width + "px"
      };
    },

    styleTranslate(): object {
      return {
        transform: "translateX(" + this.positionLeft + "px)"
      };
    }
  }
});
</script>

<style scoped lang="scss">
.spacer {
  box-sizing: border-box;
  position: absolute;
  height: 1px;
}
</style>
