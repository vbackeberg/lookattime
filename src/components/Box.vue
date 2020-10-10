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
import Vue from "vue";

export default Vue.extend({
  name: "Box",

  props: {
    positionCenter: Number,
    width: Number,
    id: Number
  },

  computed: {
    positionLeft(): number {
      return this.positionCenter - this.width / 2;
    }
  }
});
</script>

<style scoped lang="scss">
.box {
  height: 120px;
  padding: 8px;
  box-sizing: border-box;
  position: absolute;
  top: 50px;
  background-color: #42b983;
}
</style>
