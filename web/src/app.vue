<template>
  <v-app id="app">
    <v-app-bar app flat>
      <v-app-bar-nav-icon> </v-app-bar-nav-icon>
      <v-spacer />
      <v-toolbar-title>Look at time</v-toolbar-title>
      <v-spacer />
      <v-avatar color="primary" class="avatar">VB</v-avatar>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
export default {
  name: "App"
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
}

html,
body {
  height: 100%;
  padding: 0px;
  margin: 0px;
  overscroll-behavior-y: none;
  overflow-y: hidden !important;
}

.avatar {
  color: #fff;
}
</style>
