<template>
  <v-app id="app">
    <v-app-bar app flat color="#fff">
      <manage-timelines-form v-model="showManageTimelinesForm" />
      <whats-new-dialog v-model="showWhatsNewDialog" />
      <share-dialog v-model="showShareDialog" />

      <v-tooltip bottom transition="fade-transition">
        <template v-slot:activator="{ on }">
          <v-btn text icon @click.stop="showWhatsNewDialog = true" v-on="on"
            ><v-badge color="red" offset-y="8">
              <v-icon x-large>mdi-alert-decagram</v-icon></v-badge
            ></v-btn
          >
        </template>
        <span>What's new?</span>
      </v-tooltip>

      <v-spacer />

      <router-link to="/"
        ><v-toolbar-title id="app-bar-title"
          >Look at Time</v-toolbar-title
        ></router-link
      >
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ on: menu }">
          <v-tooltip bottom transition="fade-transition">
            <template v-slot:activator="{ on: tooltip }">
              <v-avatar
                v-ripple
                color="primary"
                id="app-bar-avatar"
                v-on="{ ...menu, ...tooltip }"
                >🤓</v-avatar
              >
            </template>
            <span>Your timelines</span>
          </v-tooltip>
        </template>
        <v-list v-if="!loading">
          <v-list-item @click.stop="showManageTimelinesForm = true">
            <v-icon class="app-bar-menu-button">mdi-apps</v-icon>My
            timelines</v-list-item
          >
          <v-list-item @click.stop="showShareDialog = true">
            <v-icon class="app-bar-menu-button">mdi-share-variant</v-icon
            >Share</v-list-item
          >
          <v-list-item @click.stop="startIntroduction()">
            <v-icon class="app-bar-menu-button">mdi-help</v-icon
            >Introduction</v-list-item
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
          href="https://valerianb.medium.com"
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
import WhatsNewDialog from "@/components/whats-new-dialog.vue";
import ShareDialog from "@/components/share-dialog.vue";
import mergeProps from "vue";
import TimelineModel from "./models/timeline-model";
import { v4 as uuid } from "uuid";

export default {
  name: "App",

  components: {
    ManageTimelinesForm,
    WhatsNewDialog,
    ShareDialog
  },

  data() {
    return {
      showManageTimelinesForm: false,
      showWhatsNewDialog: false,
      showShareDialog: false
    };
  },

  computed: {
    loading(): boolean {
      return store.state.loading;
    }
  },

  methods: {
    mergeProps,

    async startIntroduction() {
      if (store.state.timeEvents.length > 0) {
        await this.createNewTimeline();
      }
      store.commit("setShowIntroduction", true);
    },

    async createNewTimeline() {
      const timeline = new TimelineModel(
        uuid(),
        store.state.user.id,
        "Timeline"
      );

      await store.dispatch("addTimeline", timeline);
      store.dispatch("setSelectedTimeline", timeline);
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

#app-bar-title {
  user-select: none;
  color: rgba(0, 0, 0, 0.87);
  font-family: Comfortaa;
  font-weight: 400;
}

#app-bar-avatar {
  color: #fff;
  user-select: none;
  font-size: 24px;
  vertical-align: text-top;
}

.app-bar-menu-button {
  margin-right: 8px;
}

a {
  text-decoration: none;
}

.footer-buttons {
  margin: auto;
}
</style>
