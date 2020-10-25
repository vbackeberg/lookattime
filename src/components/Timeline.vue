<template>
  <div id="timeline">
    <box v-for="box in boxes" v-bind:key="box.id" v-bind="box"></box>
    <spacer v-bind="spacerRight"></spacer>
    <spacer-left v-bind="spacerLeft"></spacer-left>
    <spacer v-bind="spacerPageEdge"></spacer>
    <div id="horizontal-line"></div>
    <div
      class="timelineZero"
      v-bind:style="{ left: timelineZero + 'px' }"
    ></div>
  </div>
</template>

<script lang="ts">
import Box from "@/components/Box.vue";
import Vue from "vue";
import BoxModel from "@/models/box-model";
import SpacerModel from "@/models/spacer-model";
import Spacer from "@/components/Spacer.vue";
import SpacerLeft from "@/components/SpacerLeft.vue";
import store from "@/store";
import Repositioner from "@/timeline/repositioner";

let repositioner: Repositioner;

export default Vue.extend({
  name: "Timeline",

  components: {
    Box,
    Spacer,
    SpacerLeft
  },

  created() {
    window.addEventListener("wheel", (e: WheelEvent) => {
      if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      this.changeZoom(e);
    });

    store.commit(
      "addBox",
      new BoxModel(
        500,
        300,
        store.state.boxes.length,
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
      )
    );
    store.commit("setTimelineZero", window.innerWidth / 2);
  },

  mounted() {
    repositioner = new Repositioner(this.$el);
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

    timelineZero(): number {
      return store.state.timelineZero;
    }
  },

  methods: {
    changeZoom(e: WheelEvent) {
      const element = this.$el;

      if (e.deltaY < 0) {
        repositioner.zoomIn(1.1, e.pageX + element.scrollLeft);
      } else if (e.deltaY > 0) {
        repositioner.zoomOut(0.92, e.pageX + element.scrollLeft);
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
}

.timelineZero {
  height: 50px;
  width: 5px;
  background-color: #fff;
  position: absolute;
}

#horizontal-line {
  height: 10px;
  width: 100%;
  position: fixed;
  top: 50%;
  left: 0px;

  background-color: brown;
}
</style>
