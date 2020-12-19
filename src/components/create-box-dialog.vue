<template>
  <div></div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "CreateBoxDialog",

  methods: {
    close() {
      this.$emit("close");
    }
  }
});
</script>

<style lang="scss"></style>
