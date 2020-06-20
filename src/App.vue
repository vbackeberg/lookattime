<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import store from "./store";
import Vue from "vue";

export default Vue.extend({
  name: "App"
});

document.addEventListener(
  "wheel",
  function(e) {
    e.preventDefault();
  },
  { passive: false }
);

window.addEventListener("resize", function() {
  console.log(window.innerWidth / 2);
  store.commit("setCenter", window.innerWidth / 2);
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

html,
body {
  height: 100%;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}
</style>
