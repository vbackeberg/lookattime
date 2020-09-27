<template>
  <div class="home">
    <div class="controls">
      <input v-model.number="position" type="number" />
      <button v-on:click="addBox(position)">
        Add new
      </button>
    </div>
    <timeline v-bind:pboxes="this.boxes"></timeline>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Timeline from "@/components/Timeline.vue";
import BoxModel from "@/models/box-model";

export default Vue.extend({
  name: "Home",

  components: {
    Timeline
  },

  data() {
    const boxes: BoxModel[] = [];

    return {
      position: 100,
      boxes: boxes
    };
  },

  methods: {
    addBox(position: number) {
      this.boxes.push(new BoxModel(position, 200, this.boxes.length));
    }
  },

  created() {
    this.addBox(500);
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
