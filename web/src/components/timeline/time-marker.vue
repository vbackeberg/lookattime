<template>
  <transition appear>
    <!-- TODO: consider using svg instead of div for performance reasons -->
    <div
      class="marker zoom-transition zoomable"
      v-bind:style="[styleWidth]"
    ></div>
  </transition>
</template>

<script lang="ts">
import TimeMarkerModel from "@/models/time-marker-model";
import store from "@/store/store";
import Vue from "vue";

export default Vue.extend({
  name: "TimeMarker",

  props: {
    positionCenter: Number,
    id: String,
    date: Number
  },

  data() {
    return {
      styleWidth: {
        width: TimeMarkerModel.width + "px"
      }
    };
  },

  mounted() {
    this.setHTMLElement();
    this.setInitialPosition();
  },

  computed: {
    timeMarkerIndex(): number {
      const index = store.state.timeMarkers.findIndex(
        timeMarker => timeMarker.id === this.id
      );

      if (index !== -1) {
        return index;
      } else {
        throw Error("Could not get time event index because it was not found");
      }
    }
  },

  methods: {
    setHTMLElement() {
      store.state.timeMarkers[this.timeMarkerIndex].htmlElement = this
        .$el as HTMLElement;
    },

    setInitialPosition() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      store.state.timeMarkers[
        this.timeMarkerIndex
      ].htmlElement!.style.transform =
        "translateX(" +
        (this.positionCenter - TimeMarkerModel.widthOffset) +
        "px)";
    }
  }
});
</script>

<style scoped lang="scss">
.marker {
  position: absolute;
  height: 12px;
  background-color: #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 300ms ease;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>
