<template>
  <div class="spacer"></div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store/store";

export default Vue.extend({
  name: "SpacerRight",

  mounted() {
    this.setHTMLElement();
  },

  methods: {
    setHTMLElement() {
      store.state.spacerRight.htmlElement = this.$el as HTMLElement;
    }
  }
});
</script>

<style scoped lang="scss">
.spacer {
  box-sizing: border-box;
  position: absolute;
  height: 1px;
  width: 1px;
  transform-origin: left;
}
</style>
