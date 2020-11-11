<template>
  <div
    class="box zoom-transition zoomable"
    v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
  >
    <div class="image-container">
      <img class="image" src="@/assets/testimg.jpg" alt="test image" />
    </div>
    <span v-if="enoughSpace">enough space</span>
    {{ text }}
  </div>
</template>

<script lang="ts">
import BoxModel from "@/models/box-model";
import store from "@/store";
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
    },

    boxIndex(): number {
      return store.state.boxes.findIndex(box => box.id === this.id);
    },

    closestBoxLeft(): BoxModel {
      return store.state.boxes[this.boxIndex - 1];
    },

    closestBoxRight(): BoxModel {
      return store.state.boxes[this.boxIndex + 1];
    },

    enoughSpace(): boolean {
      const enoughSpaceLeft = this.closestBoxLeft
        ? this.closestBoxLeft.positionCenter +
            this.closestBoxLeft.width / 2 -
            this.positionLeft <
          0
        : true;

      const enoughSpaceRight = this.closestBoxRight
        ? this.closestBoxRight.positionCenter -
            this.closestBoxRight.width / 2 -
            (this.positionLeft + this.width) >
          0
        : true;

      return enoughSpaceLeft && enoughSpaceRight;
    }
  }
});
</script>

<style scoped lang="scss">
.box {
  height: 100%;
  position: absolute;

  padding: 8px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  border: 2px solid #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  white-space: normal;
  overflow-y: hidden;
  overflow-wrap: break-word;
  text-align: justify;

  font-size: 0.875em;
}

.image-container {
  float: right;
}

.image {
  max-width: 110px;
  max-height: 100px;
  margin-left: 10px;
}
</style>
