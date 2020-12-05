<template>
  <transition>
    <div
      class="marker zoom-transition zoomable"
      v-bind:style="{ left: positionLeft + 'px', width: width + 'px' }"
    >
      {{ date }}
    </div>
  </transition>
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
.v-enter-active {
  transition: all 300ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.v-leave-active {
  transition: all 300ms cubic-bezier(0.22, 0.61, 0.36, 1);
}
</style>
