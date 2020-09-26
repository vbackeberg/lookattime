<template>
  <div class="home">
    <div>
      <input v-model="position" placeholder="1000" type="number" />
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
      position: Number,
      boxes: boxes
    };
  },

  methods: {
    addBox(position: number) {
      this.boxes.push(new BoxModel(position, 200, 20));
    }
  }
});
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  width: 100%;
}
</style>
