<template>
  <div class="home">
    <div class="controls">
      <input v-model.number="position" type="number" />
      <button v-on:click="addBox(position)">
        Add new
      </button>
    </div>
    <timeline></timeline>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Timeline from "@/components/Timeline.vue";
import BoxModel from "@/models/box-model";
import store from "@/store";

export default Vue.extend({
  name: "Home",

  components: {
    Timeline
  },

  data() {
    return {
      position: 100
    };
  },

  methods: {
    addBox(position: number) {
      store.commit(
        "addBox",
        new BoxModel(position, 200, store.state.boxes.length)
      );
    }
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
