<template>
  <div class="home">
    <timeline ref="timelineElement"></timeline>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Timeline from "@/components/timeline.vue";

export default Vue.extend({
  name: "Home",

  components: {
    Timeline
  },

  data() {
    return {
      date: 1921,
      importance: 101
    };
  }
});
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
}
.controls {
  height: 50px;
  width: 100%;
}
</style>
