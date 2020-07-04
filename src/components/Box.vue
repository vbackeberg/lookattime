<template>
  <div
    class="box"
    v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
  >
    <p>positionLeft: {{ positionLeft }}</p>
    <p>positionCenter: {{ positionCenter }}</p>
    <p>width: {{ width }}</p>
  </div>
</template>

<script lang="ts">
import store from "../store";
import Vue from "vue";

export default Vue.extend({
  name: "Box",

  props: {
    initialPosition: String,
    width: String
  },

  data() {
    return {
      positionCenter: Number(this.initialPosition)
    };
  },

  watch: {
    zoomLevel() {
      const zoomFactor = store.state.zoomFactor;
      const mousePosition = store.state.mousePosition;

      const distance =
        (Number(this.positionCenter) - mousePosition) * zoomFactor;

      const oldPosition = this.positionCenter;

      this.positionCenter = mousePosition + distance;

      this.logPositions(
        zoomFactor,
        mousePosition,
        oldPosition,
        this.positionCenter,
        distance
      );
    }
  },

  computed: {
    zoomLevel(): number {
      return store.state.zoomLevel;
    },

    positionLeft(): number {
      return this.positionCenter - Number(this.width) / 2;
    }
  },

  methods: {
    logPositions(
      zoomFactor: number,
      mousePosition: number,
      oldPosition: number,
      positionCenter: number,
      distance: number
    ) {
      console.log(
        "zoom factor " +
          zoomFactor +
          " mouse pos " +
          mousePosition +
          " old pos: " +
          oldPosition +
          " new Pos: " +
          positionCenter +
          " distance: " +
          distance
      );
    }
  }
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
