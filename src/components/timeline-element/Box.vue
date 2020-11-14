<template>
  <div
    class="outer zoom-transition zoomable"
    v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
  >
    <transition>
      <div
        v-if="!hide"
        class="grow-transition"
        v-bind:class="{
          'buffer-top-expanded': !collapse,
          'buffer-top-collapsed': collapse
        }"
      ></div>
    </transition>
    <transition>
      <div
        v-if="!hide"
        class="box grow-transition"
        v-bind:class="{ 'box-expanded': !collapse, 'box-collapsed': collapse }"
      >
        <div class="image-container">
          <img class="image" src="@/assets/testimg.jpg" alt="test image" />
        </div>
        {{ text }}
      </div>
    </transition>
    <transition>
      <connector
        v-if="!hide"
        class="grow-transition"
        v-bind:class="{
          'connector-expanded': !collapse,
          'connector-collapsed': collapse
        }"
        v-bind:positionCenter="positionCenter"
      ></connector>
    </transition>
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

    collapse(): boolean {
      if (this.collapseRecursive(this.boxIndex, -1)) return true;
      if (this.collapseRecursive(this.boxIndex, 1)) return true;
      return false;
    },

    hide(): boolean {
      if (this.hideRecursive(this.boxIndex, -1)) return true;
      if (this.hideRecursive(this.boxIndex, 1)) return true;
      return false;
    }
  },

  methods: {
    collapseRecursive(currentBoxIndex: number, indexChange: number): boolean {
      const neighborBox = store.state.boxes[currentBoxIndex + indexChange];

      if (!neighborBox) {
        return false;
      }

      const collision =
        (this.positionCenter +
          (indexChange * this.width) / 2 -
          (neighborBox.positionCenter +
            (-indexChange * neighborBox.width) / 2)) *
          indexChange >
        0;

      if (!collision) {
        return false;
      }

      const hasPrecedence = this.importance > neighborBox.importance;

      if (!hasPrecedence) {
        return true;
      }

      return this.collapseRecursive(currentBoxIndex + indexChange, indexChange);
    },

    hideRecursive(currentBoxIndex: number, indexChange: number): boolean {
      const neighborBox = store.state.boxes[currentBoxIndex + indexChange];

      if (!neighborBox) {
        return false;
      }

      const collision =
        (this.positionCenter +
          (indexChange * BoxModel.collapsedWidth) / 2 -
          (neighborBox.positionCenter +
            (-indexChange * BoxModel.collapsedWidth) / 2)) *
          indexChange >
        0;

      if (!collision) {
        return false;
      }

      const hasPrecedence = this.importance > neighborBox.importance;

      if (!hasPrecedence) {
        return true;
      }

      return this.hideRecursive(currentBoxIndex + indexChange, indexChange);
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

.buffer-top-expanded {
  flex: 0 1 auto;
}

.buffer-top-collapsed {
  flex: 16 0 auto;
}

.box-expanded {
  flex: 4 1 auto;

  width: 100%;
  padding: 8px;
  border-radius: 10px;
}

// turn into style object to allow defining width as width from box model.
.box-collapsed {
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
