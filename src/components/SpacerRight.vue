<template>
  <div id="spacer-left">
    <spacer
      v-bind:positionLeft="this.positionLeftC"
      v-bind:width="this.width"
      v-bind:height="this.height"
      v-bind:color="this.color"
      class="zoom-transition"
    ></spacer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Spacer from "@/components/Spacer.vue";
import store from "@/store";

export default Vue.extend({
  name: "SpacerLeft",

  components: {
    Spacer
  },

  props: {
    positionLeft: Number,
    width: Number,
    height: Number,
    color: String
  },

  computed: {
    positionLeftC(): number {
      const highestBox = store.state.boxes[store.state.boxes.length - 1];
      return highestBox.positionCenter + highestBox.width / 2;
    }
  }
});
</script>

<style scoped lang="scss"></style>
