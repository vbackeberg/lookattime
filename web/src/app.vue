<template>
  <v-app id="app">
    <v-app-bar app flat color="#fff">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-spacer />
      <router-link to="/"
        ><v-toolbar-title class="app-bar-title"
          >Look at time</v-toolbar-title
        ></router-link
      >
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ on }"
          ><v-avatar v-ripple color="primary" class="app-bar-avatar" v-on="on"
            >VB</v-avatar
          ></template
        >
        <v-list>
          <v-list-item v-if="userId">{{ userId }}</v-list-item>
          <v-list-item v-if="userId" v-on:click="deleteUser()"
            >Delete User</v-list-item
          >
          <v-list-item v-if="!userId" v-on:click="createUser()"
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
import store from "./store";

export default {
  name: "App",

  computed: {
    userId(): string {
      return store.state.userId;
    }
  },

  methods: {
    async createUser() {
      try {
        await UserService.createUserId();
      } catch (e) {
        console.error("Could not create user id.", e);
      }
    },
    async deleteUser() {
      try {
        await UserService.deleteUserId();
      } catch (e) {
        console.log("Could not delete user id.", e);
      }
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
  color: rgba(0, 0, 0, 0.87);
}

.app-bar-avatar {
  color: #fff;
  user-select: none;
}

a {
  text-decoration: none;
}
</style>
