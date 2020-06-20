<template>
  <div class="box" v-bind:style="{ left: calculatedPosition }">
    <p>Abc abc abc</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Box extends Vue {
  @Prop() private position!: number;

  get calculatedPosition() {
    const pos =
      Number(this.$store.state.center) +
      Number(this.position) * this.$store.state.zoomFactor;

    return pos + "px";
  }
}
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
