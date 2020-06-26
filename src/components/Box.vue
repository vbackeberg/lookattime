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
    width: String,
  },
  data() {
    return {
      positionCenter: Number(this.initialPosition),
    };
  },
  watch: {
    zoomFactor() {
      // TODO: box still moves in wrong direction after changing zoom direction.
      // Reason is direction does not change until zoom factor reaches 1 again.
      // Current zoom factor is the wrong concept.
      //
      // Concept: Basic
      // - internalPosition remains fixed
      // - viewport moves by sideways-scrolling
      //
      // Concept: Zoom on mouse
      // - viewport centers on / moves towards mouse when zooming
      // - absolutePosition derives from internalPosition times zoom factor.
      // - distance is distance from mouse
      //
      // Concept: Zoom on center easy
      // - distance is distances from center instead mouse
      // - zoom is always from and to center

      const zoomFactor = store.state.zoomFactor;
      const windowCenter = window.innerWidth / 2;

      const distance =
        (Number(this.initialPosition) - windowCenter) * zoomFactor;

      const oldPosition = this.positionCenter;

      this.positionCenter = windowCenter + distance;

      console.log(
        "zoom factor " +
          zoomFactor +
          "screen center " +
          windowCenter +
          " old pos: " +
          oldPosition +
          " new Pos: " +
          this.positionCenter +
          " distance: " +
          distance
      );
    },
  },
  computed: {
    zoomFactor(): number {
      return store.state.zoomFactor;
    },

    positionLeft(): number {
      return this.positionCenter - Number(this.width) / 2;
    },
  },
  methods: {},
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
