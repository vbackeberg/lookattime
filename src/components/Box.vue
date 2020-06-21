<template>
  <div class="box" v-bind:style="{ left: position + 'px' }">
    <p>Abc abc abc</p>
  </div>
</template>

<script lang="ts">
import store from "../store";
import Vue from "vue";

export default Vue.extend({
  name: "Box",
  props: {
    initialPosition: String
  },
  data() {
    return {
      position: Number(this.initialPosition)
    };
  },
  watch: {
    mousePosition(value) {
      const distance =
        (this.position - this.mousePosition) * store.state.zoomFactor;

      const oldPos = this.position;

      this.position = this.mousePosition + distance;

      console.log("old pos" + oldPos + "new Pos" + this.position);
    }
  },
  computed: {
    mousePosition(): number {
      return store.state.mousePosition;
    }
  },
  methods: {}
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.box {
  height: 100px;
  width: 200px;
  margin: 20px;
  padding: 16px;
  position: absolute;
  top: 50px;
  background-color: #42b983;
}
</style>
