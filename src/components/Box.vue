<template>
  <div class="box" v-bind:style="{ left: absolutePosition + 'px' }">
    <p>Abc abc abc</p>
  </div>
</template>

<script lang="ts">
import store from "../store";
import Vue from "vue";

export default Vue.extend({
  name: "Box",
  props: {
    position: Number
  },
  computed: {
    absolutePosition: function(): number {
      return store.state.mousePosition + this.calculateDistance();
    }
  },
  methods: {
    calculateDistance(): number {
      return (
        (this.absolutePosition - store.state.mousePosition) *
        store.state.zoomFactor
      );
    }
  }
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
