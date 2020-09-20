<template>
  <div
    class="spacer"
    v-bind:style="{
      left: positionLeft + 'px',
      width: width + 'px',
      backgroundColor: color
    }"
  >
    <p>positionLeft: {{ positionLeft }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Spacer",

  props: {
    positionLeft: Number,
    width: Number,
    color: String
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.spacer {
  height: 20px;
  box-sizing: border-box;
  padding: 8px;
  position: absolute;
  transition-property: position;
  transition-timing-function: ease;
}
</style>
