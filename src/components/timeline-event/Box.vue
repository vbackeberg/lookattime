<template>
  <div
    class="zoom-container zoom-transition zoomable"
    v-bind:style="styleZoomContainer"
  >
    <div
      class="grow-transition"
      v-bind:class="{
        'buffer-top-box': !collapse,
        'buffer-top-bubble': collapse,
        'buffer-top-dot': hide
      }"
    ></div>
    <div
      class="content grow-transition"
      v-bind:class="{
        box: !collapse,
        bubble: collapse,
        dot: hide
      }"
    >
      <transition>
        <div v-if="!hide">
          <div class="image-container">
            <v-img :src="image" class="image" alt="time event image"></v-img>
          </div>
          {{ text }}
        </div>
      </transition>
    </div>
    <connector
      class="grow-transition"
      v-if="!hide"
      v-bind:class="{
        'connector-box': !collapse,
        'connector-bubble': collapse
      }"
    ></connector>
  </div>
</template>

<script lang="ts">
import BoxModel from "@/models/box-model";
import store from "@/store";
import Vue from "vue";
import Connector from "./connector.vue";

export default Vue.extend({
  name: "Box",

  components: {
    Connector
  },

  props: {
    positionCenter: Number,
    id: Number,
    text: String,
    importance: Number,
    images: Array
  },

  computed: {
    image(): string {
      return URL.createObjectURL((this.images as File[])[0]);
    },

    styleZoomContainer() {
      return {
        left: this.positionCenter - BoxModel.expandedWidth / 2 + "px",
        width: BoxModel.expandedWidth + "px"
      };
    },

    boxIndex(): number {
      return store.state.boxes.findIndex(box => box.id === this.id);
    },

    collapse(): boolean {
      if (this.shouldShrink(this.boxIndex, -1, BoxModel.expandedWidth))
        return true;
      if (this.shouldShrink(this.boxIndex, 1, BoxModel.expandedWidth))
        return true;
      return false;
    },

    hide(): boolean {
      if (this.shouldShrink(this.boxIndex, -1, BoxModel.collapsedWidth))
        return true;
      if (this.shouldShrink(this.boxIndex, 1, BoxModel.collapsedWidth))
        return true;
      return false;
    }
  },

  methods: {
    shouldShrink(
      currentBoxIndex: number,
      indexChange: number,
      width: number
    ): boolean {
      const neighborBox = store.state.boxes[currentBoxIndex + indexChange];

      if (!neighborBox) {
        return false;
      }

      const collision =
        (this.positionCenter +
          (indexChange * width) / 2 -
          (neighborBox.positionCenter + (-indexChange * width) / 2)) *
          indexChange >
        0;

      if (!collision) {
        return false;
      }

      const hasPrecedence = this.importance > neighborBox.importance;

      if (!hasPrecedence) {
        return true;
      }

      return this.shouldShrink(
        currentBoxIndex + indexChange,
        indexChange,
        width
      );
    }
  }
});
</script>

<style scoped lang="scss">
.zoom-container {
  position: absolute;
  height: 100%;

  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: center;
}

.content {
  box-sizing: border-box;
  background-color: #fff;
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

.grow-transition {
  transition: all 300ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.buffer-top-box {
  flex: 0 1 auto;
}

.buffer-top-bubble {
  flex: 16 0 auto;
}

.buffer-top-dot {
  flex: 16 0 auto;
}

.box {
  flex: 4 1 auto;

  width: 100%;
  padding: 8px;
  border-radius: 10px;
}

.bubble {
  flex: 0 0 auto;

  width: 50px;
  height: 50px;
  margin-left: 125px;
  margin-right: 125px;
  border-radius: 25px;
}

.dot {
  flex: 0 0 auto;

  width: 16px;
  height: 8px;
  margin-left: 146px;
  margin-right: 146px;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  border: 1px solid #000;
  border-bottom: 0;
  background-color: #000;
}

.connector-box {
  flex: 1 0 68px;
}

.connector-bubble {
  flex: 1 0 2px;
}

.v-enter-active {
  transition: all 300ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.v-leave-active {
  transition: all 300ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>
