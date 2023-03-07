<template>
  <div class="ck-content" v-html="value"></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "EditorReadMode",

  props: {
    value: String
  }
});
</script>

<style lang="scss" scoped></style>
