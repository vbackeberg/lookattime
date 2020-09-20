<template>
  <div
    class="spacer"
    v-bind:style="{
      left: positionLeft + 'px',
      width: width + 'px',
      height: height + 'px',
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
    width: Number,
    height: Number,
    color: String
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.spacer {
  box-sizing: border-box;
  position: absolute;
  transition-property: position;
  transition-timing-function: ease;
}
</style>
