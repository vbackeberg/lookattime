<template>
  <div
    class="box"
    v-bind:style="{ left: position + 'px', width: width + 'px' }"
  >
    <p>{{ position }}</p>
    <p>{{ width }}</p>
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
      center: Number(this.initialPosition)
    };
  },
  watch: {
    zoomFactor() {
      // TODO: box still moves in wrong direction after changing zoom direction.

      const zoomFactor = store.state.zoomFactor;
      const mousePosition = store.state.mousePosition;

      const distance = (this.center - mousePosition) * zoomFactor;

      const oldPos = this.center;

      this.center = mousePosition + distance;

      console.log(
        "zoom factor " +
          zoomFactor +
          "mouse pos " +
          mousePosition +
          " old pos: " +
          oldPos +
          " new Pos: " +
          this.center +
          " distance: " +
          distance
      );
    }
  },
  computed: {
    zoomFactor(): number {
      return store.state.zoomFactor;
    },

    position(): number {
      return this.center - Number(this.width) / 2;
    }
  },
  methods: {}
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
