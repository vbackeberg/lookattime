<template>
  <div class="marker"></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TimeMarker",

  props: {
    positionLeft: Number,
    width: Number
  }
});
</script>

<style scoped lang="scss">
.marker {
  width: 4px;
  height: 16px;
  background-color: brown;
}
</style>
