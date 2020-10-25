<template>
  <div
    class="spacer"
    v-bind:style="{
      left: positionLeft + 'px',
      backgroundColor: color
    }"
  ></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Spacer",

  props: {
    positionLeft: Number,
    color: String
  }
});
</script>

<style scoped lang="scss">
.spacer {
  box-sizing: border-box;
  position: absolute;
  width: 200px;
  height: 1px;
}
</style>
