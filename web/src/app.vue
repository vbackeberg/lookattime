<template>
  <v-app id="app">
    <v-app-bar app flat color="#fff">
      <manage-timelines-form v-model="showManageTimelinesForm" />
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
          <v-list-item @click.stop="showManageTimelinesForm = true"
            >My timelines</v-list-item
          >
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
    <v-footer app color="white" padless>
      <v-row justify="center" no-gutters>
        <v-btn text rounded class="my-2" to="/about">
          Impressum
        </v-btn>
        <v-btn text rounded class="my-2">
          Blog
        </v-btn>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import ManageTimelinesForm from "@/components/user/manage-timelines-form.vue";
import store from "./store";

export default {
  name: "App",

  components: {
    ManageTimelinesForm
  },

  async mounted() {
    await store.dispatch("loadUser");
  },

  data() {
    return { showManageTimelinesForm: false };
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
