<template>
  <div
    class="outer zoom-transition zoomable"
    v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
  >
    <div class="box" v-bind:class="{ expanded: !hide, collapsed: hide }">
      <div class="image-container">
        <img class="image" src="@/assets/testimg.jpg" alt="test image" />
      </div>
      {{ text }}
    </div>
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
    text: String,
    importance: Number
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

    //TODO rename to collapsed
    hide(): boolean {
      if (this.closestBoxLeft) {
        const collisionLeft =
          this.closestBoxLeft.positionCenter +
            this.closestBoxLeft.width / 2 -
            this.positionLeft >
          0;

        const hasNoPrecedence =
          this.importance < this.closestBoxLeft.importance;

        return collisionLeft && hasNoPrecedence;
      }

      if (this.closestBoxRight) {
        const collisionRight =
          this.closestBoxRight.positionCenter -
            this.closestBoxRight.width / 2 -
            (this.positionLeft + this.width) <
          0;

        const hasNoPrecedence =
          this.importance < this.closestBoxRight.importance;

        return collisionRight && hasNoPrecedence;
      }

      return false;
    }
  }
});
</script>

<style scoped lang="scss">
.outer {
  position: absolute;
  height: 100%;
}

.box {
  box-sizing: border-box;
  background-color: #fff;
  border: 2px solid #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  white-space: normal;
  overflow-y: hidden;
  overflow-wrap: break-word;
  text-align: justify;

  font-size: 0.875em;

  transition: all 300ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.image-container {
  float: right;
}

.image {
  max-width: 110px;
  max-height: 100px;
  margin-left: 10px;
}

.expanded {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 100%;
  padding: 8px;
  border-radius: 10px;
}

.collapsed {
  position: absolute;
  bottom: 0px;
  width: 50px;
  height: 50px;
  margin-left: 125px;
  margin-right: 125px;
  border-radius: 25px;
}
</style>
