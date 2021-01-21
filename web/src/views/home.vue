<template>
  <div class="home">
    <prevent-mobile-dialog v-model="isMobile"></prevent-mobile-dialog>
    <timeline ref="timelineElement"></timeline>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Timeline from "@/components/timeline/timeline.vue";
import PreventMobileDialog from "@/components/prevent-mobile-dialog.vue";

export default Vue.extend({
  name: "Home",

  components: {
    Timeline,
    PreventMobileDialog
  },

  data() {
    return { isMobile: navigator.maxTouchPoints > 1 };
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
