<template>
  <div>
    <step
      :key="1"
      v-if="step === 1"
      v-on:next="next()"
      anchorElementIdOrClass="fab"
      location="left"
      text="Look at Time allows you to create interactive timelines. Let's start by creating your first time event. Click here 👉"
    ></step>

    <step
      :key="2"
      v-if="step === 2"
      v-on:next="next()"
      anchorElementIdOrClass="event-title"
      location="bottom"
      text="This is your editor. You can add a title, a date and the importance of your event. Importance allows you to keep an overview when you zoom out. When two events come close to each other, the one with lower importance will fade out."
    ></step>

    <step
      :key="3"
      v-if="step === 3"
      v-on:next="next()"
      anchorElementIdOrClass="text-area-btn-save"
      location="top"
      text="Hit save when you have filled out every mandatory field."
    ></step>

    <step
      :key="4"
      v-if="step === 4"
      v-on:next="next()"
      anchorElementIdOrClass="content"
      triggerElementIdOrClass="fab"
      location="top"
      text="Great, you have created your first time event! Now, click the blue plus button on the lower right, once again. As soon as we have a second time event, you'll see the magic happen."
    ></step>

    <step
      :key="5"
      v-if="step === 5"
      v-on:next="next()"
      anchorElementIdOrClass="text-area-btn-save"
      location="top"
      text="Fill out the fields and hit the save button. Make sure you pick a date that is a few days apart from the first one!"
    ></step>

    <step
      :key="6"
      v-if="step === 6"
      v-on:next="next()"
      anchorElementIdOrClass="horizontal-line"
      triggerElementIdOrClass="timeline"
      location="top"
      trigger="wheel"
      text="Whoa! What happened? Your timeline has come to live. Below you can see where you are in time. Use your mouse wheel to zoom in and out."
    ></step>

    <step
      :key="7"
      v-if="step === 7"
      v-on:next="stopIntroduction()"
      anchorElementIdOrClass="app-bar-avatar"
      location="left"
      text="I have one last hint for you, traveler. Click on your avatar above to access your timelines and create new ones. Now, have a good flight!"
      class="mt-14"
    ></step>

    <v-card id="dialog" rounded="xl" v-show="showDialog">
      <div id="title-container">
        <div id="astronaut" class="emoji">🧑‍🚀</div>
        <v-card-title id="title">
          <p>Welcome time traveler!</p>
          <p>Would you like to get an introduction?</p>
        </v-card-title>
      </div>
      <v-card-actions class="d-flex flex-column">
        <v-btn block color="primary" @click="startIntroduction()"
          >Take the tour</v-btn
        >
        <v-btn
          block
          color="tertiary"
          @click="stopIntroduction()"
          class="mt-3 ml-0"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-btn
      v-show="step > 0"
      id="btn-end"
      color="secondary"
      elevation="10"
      @click="stopIntroduction()"
      ><v-icon>mdi-close</v-icon>End Tour</v-btn
    >
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Step from "@/components/introduction/step.vue";
import store from "@/store/store";
import { mapState } from "vuex";

export default Vue.extend({
  name: "Introduction",

  components: {
    Step
  },

  data() {
    return {
      showDialog: true,
      step: 0
    };
  },

  computed: { ...mapState(["timeEvents"]) },

  watch: {
    timeEvents: {
      immediate: true,
      handler(timeEvents) {
        if (timeEvents.length > 0 && this.step === 0) {
          store.commit("setShowIntroduction", false);
        }
      }
    }
  },

  methods: {
    startIntroduction() {
      this.showDialog = false;
      this.step = 1;
    },

    stopIntroduction() {
      this.step = 0;
      store.commit("setShowIntroduction", false);
    },

    next() {
      this.step++;
    }
  }
});
</script>

<style lang="scss" scoped>
#dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  padding: 24px;
  width: 400px;
  height: 300px;
  text-align: center;
}

#title-container {
  display: flex;
  flex-direction: row;
}

#astronaut {
  width: 30%;

  font-size: 6em;

  display: flex;
  justify-content: center;
  align-items: center;
}

#title {
  width: 70%;

  word-break: normal;

  justify-content: center;
  align-items: center;
}

::v-deep .v-overlay__content {
  // These allow the steps to be absolutely positioned.
  width: 100%;
  height: 100%;

  // This allows btn-end to be centered via margin auto.
  display: flex;
}

#btn-end {
  position: absolute;
  left: 64px;
  top: 64px;
}
</style>
