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
            >🤓</v-avatar
          ></template
        >
        <v-list v-if="!loading">
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
      <div class="footer-buttons">
        <v-btn
          text
          rounded
          x-small
          class="my-2"
          href="https://www.blog.lookattime.com/"
          target="_blank"
        >
          Blog
        </v-btn>
        <v-btn
          text
          rounded
          x-small
          class="my-2"
          href="mailto:contact.lookattime@gmail.com?subject=My%20feedback%20on%20Look%20At%20Time&amp;body=Feel%20free%20to%20include%20a%20screenshot%20of%20your%20issue."
        >
          Feedback
        </v-btn>
        <v-btn text rounded x-small class="my-2" to="/legal-disclosure">
          Legal Disclosure
        </v-btn>
        <v-btn text rounded x-small class="my-2" to="/privacy-policy">
          Privacy Policy
        </v-btn>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import ManageTimelinesForm from "@/components/user/manage-timelines-form.vue";
import store from "./store/store";

export default {
  name: "App",

  components: {
    ManageTimelinesForm
  },

  data() {
    return { showManageTimelinesForm: false };
  },

  computed: {
    loading(): boolean {
      return store.state.loading;
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
  overflow-y: hidden;
}

.app-bar-title {
  user-select: none;
  color: rgba(0, 0, 0, 0.87);
}

.app-bar-avatar {
  color: #fff;
  user-select: none;
  font-size: 24px;
  vertical-align: text-top;
}

a {
  text-decoration: none;
}

.footer-buttons {
  margin: auto;
}
</style>
