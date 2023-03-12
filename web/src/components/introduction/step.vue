<template>
  <v-slide-x-transition>
    <v-card elevation="10" class="step-card"
      ><v-card-text class="black--text"
        >Let's start by creating your first time event. Click here
        👉</v-card-text
      ></v-card
    >
  </v-slide-x-transition>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Step",

  props: {
    anchorElementId: String,
    right: Boolean,
    bottom: Boolean
  },

  mounted() {
    const anchorElement = document.getElementById(this.anchorElementId)!!;
    anchorElement.style.zIndex = "401";

    const margin = 24;

    if (this.right) {
      const position =
        document.documentElement.clientWidth -
        anchorElement.getBoundingClientRect().left +
        margin;

      (this.$el as HTMLElement).style.right = position + "px";
    } else {
      const position = anchorElement.getBoundingClientRect().right + margin;

      (this.$el as HTMLElement).style.left = position + "px";
    }

    if (this.bottom) {
      const position =
        document.documentElement.clientHeight -
        anchorElement.getBoundingClientRect().bottom;

      (this.$el as HTMLElement).style.bottom = position + "px";
    } else {
      const position = anchorElement.getBoundingClientRect().top;

      (this.$el as HTMLElement).style.top = position + "px";
    }
  }
});
</script>
<style lang="scss" scoped>
$max-width: 240px;

.step-card {
  position: absolute;
  max-width: $max-width;
  height: fit-content;
}
</style>
