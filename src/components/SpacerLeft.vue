<template>
  <div id="spacer-left">
    <spacer v-bind="$props" class="zoom-transition"></spacer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SpaceExtender from "@/timeline/space-extender";
import SpaceCutter from "@/timeline/space-cutter";
import Spacer from "@/components/Spacer.vue";

export default Vue.extend({
  name: "SpacerLeft",

  components: {
    Spacer
  },

  props: {
    positionLeft: Number,
    color: String,
    width: Number
  },

  mounted() {
    new SpaceExtender();
    new SpaceCutter();
  }
});
</script>

<style scoped lang="scss"></style>
