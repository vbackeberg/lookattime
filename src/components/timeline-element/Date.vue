<template>
  <div class="date zoom-transition zoomable" v-bind:style="styleDate">
    <transition>
      <div v-if="!hide" class="inner">
        {{ this.box.date }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import BoxModel from "@/models/box-model";
import store from "@/store";
import Vue from "vue";
export default Vue.extend({
  name: "Date",

  props: {
    box: BoxModel
  },

  computed: {
    styleDate() {
      return {
        left: this.box.positionCenter - BoxModel.expandedWidth / 2 + "px",
        width: BoxModel.expandedWidth + "px"
      };
    },

    boxIndex(): number {
      return store.state.boxes.findIndex(box => box.id === this.box.id);
    },

    hide(): boolean {
      if (this.hideRecursive(this.boxIndex, -1)) return true;
      if (this.hideRecursive(this.boxIndex, 1)) return true;
      return false;
    }
  },

  methods: {
    hideRecursive(currentBoxIndex: number, indexChange: number): boolean {
      const neighborBox = store.state.boxes[currentBoxIndex + indexChange];

      if (!neighborBox) {
        return false;
      }

      const collision =
        (this.box.positionCenter +
          (indexChange * BoxModel.collapsedWidth) / 2 -
          (neighborBox.positionCenter +
            (-indexChange * BoxModel.collapsedWidth) / 2)) *
          indexChange >
        0;

      if (!collision) {
        return false;
      }

      const hasPrecedence = this.box.importance > neighborBox.importance;

      if (!hasPrecedence) {
        return true;
      }

      return this.hideRecursive(currentBoxIndex + indexChange, indexChange);
    }
  }
});
</script>

<style scoped lang="scss">
.date {
  position: absolute;
  vertical-align: top;

  text-align: center;
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
