<template>
  <div
    class="spacer"
    v-bind:style="{
      left: positionLeft + 'px',
      backgroundColor: color,
      width: width + 'px'
    }"
  ></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Spacer",

  props: {
    positionLeft: Number,
    color: String,
    width: Number
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
