<template>
  <div class="spacer"></div>
</template>

<script lang="ts">
import store from "@/store/store";
import Vue from "vue";

export default Vue.extend({
  name: "SpacerPageEdge",

  mounted() {
    this.setHTMLElement();
  },

  methods: {
    setHTMLElement() {
      store.state.spacerPageEdge.htmlElement = this.$el as HTMLElement;
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
