<template>
  <div id="timeline">
    <div id="buffer-top-area">
      <spacer v-bind="spacerRight"></spacer>
      <spacer-left ref="spacerLeftElement" v-bind="spacerLeft"></spacer-left>
      <spacer v-bind="spacerPageEdge"></spacer>
    </div>
    <div id="box-area">
      <box v-for="box in boxes" :key="box.id" v-bind="box"></box>
    </div>
    <div
      id="horizontal-line"
      v-bind:style="{ width: horizontalLineWidth + 'px' }"
    ></div>
    <div id="buffer-bottom-area">
      <date v-for="box in boxes" :key="box.id" v-bind:box="box"></date>
      <timeMarker
        v-for="timeMarker in timeMarkers"
        v-bind="timeMarker"
        :key="timeMarker.id"
      ></timeMarker>
    </div>
  </div>
</template>

<script lang="ts">
import Box from "@/components/timeline-event/Box.vue";
import Vue from "vue";
import BoxModel from "@/models/box-model";
import SpacerModel from "@/models/spacer-model";
import Spacer from "@/components/Spacer.vue";
import SpacerLeft from "@/components/SpacerLeft.vue";
import store from "@/store";
import Zoomer from "@/timeline/zoomer";
import Date from "@/components/timeline-event/Date.vue";
import SpaceWatcher from "@/timeline/space-watcher";
import TimeMarkerModel from "@/models/time-marker-model";
import TimeMarker from "@/components/TimeMarker.vue";
import TimeMarkerCreator from "@/timeline/time-marker-creator";

let zoomer: Zoomer;
let timeMarkerCreator: TimeMarkerCreator;

export default Vue.extend({
  name: "Timeline",

  components: {
    Box,
    Spacer,
    SpacerLeft,
    Date,
    TimeMarker
  },

  mounted() {
    store.commit("setTimelineZero", this.$el.clientWidth / 2);

    zoomer = Zoomer.Instance;
    new SpaceWatcher(this.$el, (this.$refs.spacerLeftElement as Vue).$el);
    timeMarkerCreator = TimeMarkerCreator.Instance;

    window.addEventListener("wheel", (e: WheelEvent) => {
      if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      this.changeZoom(e);
    });
  },

  computed: {
    boxes(): BoxModel[] {
      return store.state.boxes;
    },

    spacerRight(): SpacerModel {
      return store.getters.spacerRight;
    },

    spacerLeft(): SpacerModel {
      return store.getters.spacerLeft;
    },

    spacerPageEdge(): SpacerModel {
      return store.state.spacerPageEdge;
    },

    horizontalLineWidth(): number {
      return Math.max(
        store.state.spacerPageEdge.positionLeft +
          store.state.spacerPageEdge.width,
        this.spacerRight.positionLeft + this.spacerRight.width
      );
    },

    //TODO: Move time markers into separate component
    timeMarkers(): TimeMarkerModel[] {
      return store.state.timeMarkers;
    },

    timeMarkerDistance(): number {
      return store.getters.timeMarkerDistance;
    }
  },

  methods: {
    changeZoom(e: WheelEvent) {
      if (e.deltaY < 0) {
        zoomer.zoom(1.1, e.pageX + this.$el.scrollLeft);
      } else if (e.deltaY > 0) {
        zoomer.zoom(0.92, e.pageX + this.$el.scrollLeft);
      }
    }
  },

  //TODO put time markers in own component
  watch: {
    timeMarkerDistance(oldDistance, newDistance) {
      const maxDistance = 500;
      const minDistance = 200;

      if (newDistance > maxDistance) {
        // Add in between
      }

      if (newDistance < minDistance) {
        // remove markers at current depth
        // increase depth by ^10
      }

      const leftEdge = Math.min(this.spacerLeft.positionLeft, 0);
      if (store.state.timeMarkers[0].positionCenter - leftEdge > newDistance) {
        store.commit("unshiftTimeMarkers", timeMarkerCreator.createMarkersLeft);
      }

      const rightEdge = Math.max(
        this.spacerRight.positionLeft + this.spacerRight.width,
        store.state.spacerPageEdge.positionLeft +
          store.state.spacerPageEdge.width
      );
      if (
        rightEdge -
          store.state.timeMarkers[store.state.timeMarkers.length - 1]
            .positionCenter >
        newDistance
      ) {
        store.commit("pushTimeMarkers", timeMarkerCreator.createMarkersRight);
      }
    }
  }
});
</script>

<style scoped lang="scss">
#timeline {
  flex: 1;
  width: 100%;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: scroll;
  position: relative;
  background-color: #fff;

  display: flex;
  flex-flow: column nowrap;
}

#buffer-top-area {
  flex: 1 0 20px;
}

#box-area {
  flex: 2 0 200px;

  position: relative;
}

#horizontal-line {
  flex: 0 0 8px;

  background-color: #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#buffer-bottom-area {
  flex: 4;
}
</style>
