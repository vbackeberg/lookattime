<template>
  <div class="home">
    <div class="controls">
      <v-btn color="accent" large @click.stop="showCreateBoxForm = true"
        >Add Event</v-btn
      >
    </div>
    <create-box-form v-model="showCreateBoxForm" />
    <timeline ref="timelineElement"></timeline>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Timeline from "@/components/timeline.vue";
import BoxModel from "@/models/box-model";
import store from "@/store";
import BoxCreator from "@/timeline/box-creator";
import CreateBoxForm from "@/components/create-box-form.vue";

let boxCreator: BoxCreator;

export default Vue.extend({
  name: "Home",

  components: {
    Timeline,
    CreateBoxForm
  },

  mounted() {
    boxCreator = BoxCreator.Instance;
    this.addBox();
  },

  data() {
    return {
      date: 1921,
      importance: 101,
      showCreateBoxForm: false
    };
  },
  methods: {
    addBox() {
      return true;
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
