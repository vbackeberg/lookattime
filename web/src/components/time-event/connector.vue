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
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
