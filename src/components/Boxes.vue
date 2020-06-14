<template>
  <div class="box" v-bind:style="{ left: calculatedPosition }"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Boxes extends Vue {
  @Prop() private myPosition!: number;

  get calculatedPosition() {
    return this.myPosition * 1 + "px";
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.box {
  height: 100px;
  width: 100px;
  margin: 20px;
  position: absolute;
  top: 50px;
  background-color: #42b983;
}
</style>
