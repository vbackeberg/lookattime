<template>
  <v-app id="app">
    <v-app-bar app flat>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-spacer />
      <v-toolbar-title class="app-bar-title">Look at time</v-toolbar-title>
      <v-spacer />
      <v-avatar color="primary" class="app-bar-avatar">VB</v-avatar>
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

.app-bar-title {
  user-select: none;
}

.app-bar-avatar {
  color: #fff;
  user-select: none;
}
</style>
