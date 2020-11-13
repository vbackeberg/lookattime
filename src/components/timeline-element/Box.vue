<template>
  <div
    class="outer zoom-transition zoomable"
    v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
  >
    <div
      v-bind:class="{
        'buffer-top-expanded': !collapse,
        'buffer-top-collapsed': collapse
      }"
    ></div>
    <div
      class="box"
      v-bind:class="{ expanded: !collapse, collapsed: collapse }"
    >
      <div class="image-container">
        <img class="image" src="@/assets/testimg.jpg" alt="test image" />
      </div>
      {{ text }}
    </div>
    <connector
      v-bind:class="{
        'connector-expanded': !collapse,
        'connector-collapsed': collapse
      }"
      v-bind:positionCenter="positionCenter"
    ></connector>
  </div>
</template>

<script lang="ts">
import BoxModel from "@/models/box-model";
import store from "@/store";
import Vue from "vue";
import Connector from "./Connector.vue";

export default Vue.extend({
  name: "Box",

  components: {
    Connector
  },

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

    collapse(): boolean {
      if (this.closestBoxLeft) {
        const collisionLeft =
          this.closestBoxLeft.positionCenter +
            this.closestBoxLeft.width / 2 -
            this.positionLeft >
          0;

        const hasNoPrecedence =
          this.importance < this.closestBoxLeft.importance;

        if (collisionLeft && hasNoPrecedence) return true;
      }

      if (this.closestBoxRight) {
        const collisionRight =
          this.closestBoxRight.positionCenter -
            this.closestBoxRight.width / 2 -
            (this.positionLeft + this.width) <
          0;

        const hasNoPrecedence =
          this.importance < this.closestBoxRight.importance;

        if (collisionRight && hasNoPrecedence) return true;
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

  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: center;
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

  transition: all 500ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.image-container {
  float: right;
}

.image {
  max-width: 110px;
  max-height: 100px;
  margin-left: 10px;
}

.buffer-top-expanded {
  flex: 0 1 auto;
}

.buffer-top-collapsed {
  flex: 16 0 auto;
}

.expanded {
  flex: 4 1 auto;

  width: 100%;
  padding: 8px;
  border-radius: 10px;
}

.collapsed {
  flex: 0 0 auto;

  width: 50px;
  height: 50px;
  margin-left: 125px;
  margin-right: 125px;
  border-radius: 25px;
}

.connector-expanded {
  flex: 1 0 68px;
}

.connector-collapsed {
  flex: 1 0 2px;
}
</style>
