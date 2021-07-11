<template>
  <div class="date zoom-transition zoomable" v-bind:style="[styleWidth]">
    <transition>
      <div v-if="!hide" class="inner">
        {{ this.timeEvent.date }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";
import Vue from "vue";
export default Vue.extend({
  name: "Date",

  props: {
    timeEvent: TimeEventModel
  },

  data() {
    return {
      styleWidth: {
        width: TimeEventModel.expandedWidth + "px"
      }
    };
  },

  computed: {
    timeEventIndex(): number {
      return store.state.timeEvents.findIndex(
        timeEvent => timeEvent.id === this.timeEvent.id
      );
    },

    hide(): boolean {
      if (this.hideRecursive(this.timeEventIndex, -1)) return true;
      if (this.hideRecursive(this.timeEventIndex, 1)) return true;
      return false;
    }
  },

  methods: {
    hideRecursive(currentTimeEventIndex: number, indexChange: number): boolean {
      const neighborTimeEvent =
        store.state.timeEvents[currentTimeEventIndex + indexChange];

      if (!neighborTimeEvent) {
        return false;
      }

      const collision =
        (this.timeEvent.positionCenter +
          (indexChange * TimeEventModel.collapsedWidth) / 2 -
          (neighborTimeEvent.positionCenter +
            (-indexChange * TimeEventModel.collapsedWidth) / 2)) *
          indexChange >
        0;

      if (!collision) {
        return false;
      }

      const hasPrecedence =
        this.timeEvent.importance > neighborTimeEvent.importance;

      if (!hasPrecedence) {
        return true;
      }

      return this.hideRecursive(
        currentTimeEventIndex + indexChange,
        indexChange
      );
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
