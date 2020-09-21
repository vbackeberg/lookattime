<template>
  <div class="home">
    <div>
      <button>Add new</button>
    </div>
    <timeline></timeline>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Timeline from "@/components/Timeline.vue";

export default Vue.extend({
  name: "Home",

  components: {
    Timeline
  }
});
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  width: 100%;
}
</style>
