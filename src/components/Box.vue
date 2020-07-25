<template>
  <div
    class="box"
    v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
  >
    <p>positionLeft: {{ positionLeft }}</p>
    <p>width: {{ width }}</p>
  </div>
</template>

<script lang="ts">
import store from "../store";
import Vue from "vue";

export default Vue.extend({
  name: "Box",

  props: {
    positionLeft: Number,
    width: Number,
    id: Number,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.box {
  height: 100px;
  padding: 16px;
  position: absolute;
  top: 50px;
  background-color: #42b983;
}
</style>
