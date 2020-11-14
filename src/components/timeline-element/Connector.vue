<template>
  <div class="connector" v-bind:style="{ width: width + 'px' }"></div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Connector",

  data() {
    return {
      width: 2
    };
  }
});
</script>

<style scoped lang="scss">
.connector {
  height: 100%;
  background-color: #000;
}
</style>
