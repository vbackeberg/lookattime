<template>
  <div
    class="marker zoomable"
    v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
  >
    {{ date }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TimeMarker",

  data() {
    return {
      width: 4
    };
  },

  props: {
    positionCenter: Number,
    id: String,
    date: Number
  },

  computed: {
    positionLeft(): number {
      return this.positionCenter - this.width / 2;
    }
  }
});
</script>

<style scoped lang="scss">
.marker {
  position: absolute;
  height: 16px;
  background-color: brown;
}
</style>
