<template>
  <v-app id="app">
    <v-app-bar app flat color="#fff">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-spacer />
      <v-toolbar-title class="app-bar-title">Look at time</v-toolbar-title>
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ on }"
          ><v-avatar v-ripple color="primary" class="app-bar-avatar" v-on="on"
            >VB</v-avatar
          ></template
        >
        <v-list>
          <v-list-item v-if="hasUserId">{{ userId }}</v-list-item>
          <v-list-item v-if="!hasUserId" v-on:click="createUser()"
            >Create User</v-list-item
          >
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import UserService from "./user/user-service";

export default {
  name: "App",

  computed: {
    userId(): string {
      return UserService.getUserId();
    },

    hasUserId(): boolean {
      return UserService.hasUserId();
    }
  },

  methods: {
    createUser() {
      UserService.createUserId();
    }
  }
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
