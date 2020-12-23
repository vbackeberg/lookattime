<template>
  <div
    class="spacer"
    v-bind:style="{
      left: positionLeft + 'px',
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
