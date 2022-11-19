<template>
  <div class="container"></div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "EditorWriteMode",

  props: {
    value: String
  },

  mounted() {},

  methods: {},

  data() {},

  components: {}
});
</script>
<style lang="scss" scoped>
@import "src/colors.scss";
@import "src/components/timeline/time-event/fullscreen/fullscreen.scss";

.container {
  flex: 1 0 auto;
  padding: 0;

  display: flex;
  flex-direction: column;
}
</style>
