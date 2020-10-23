<template>
  <div
    class="box zoom-transition"
    v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
  >
    {{ text }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Box",

  props: {
    positionCenter: Number,
    width: Number,
    id: Number,
    text: String
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
  background-color: #fff;
  border-radius: 10px;
  border: 2px solid #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  overflow: auto;
  word-wrap: break-word;
}
</style>
