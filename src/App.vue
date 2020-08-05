<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: "App",
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: fit-content;
}

html,
body {
  height: 100%;
  width: fit-content;
  padding: 0px;
  margin: 0px;
  overscroll-behavior-y: none;
}
</style>
