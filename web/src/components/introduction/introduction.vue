<template>
  <div id="container">
    <v-overlay :value="overlay" :z-index="400" opacity="0.3" :dark="false">
      <v-btn id="btn-end" color="secondary" @click="stopIntroduction()"
        ><v-icon>mdi-close</v-icon>End Tour</v-btn
      >

      <step
        v-if="step === 1"
        anchorElementId="fab"
        :right="true"
        :bottom="true"
      ></step>
    </v-overlay>

    <v-slide-y-transition>
      <v-card id="dialog" rounded="xl" v-show="!overlay">
        <div id="title-container">
          <div id="astronaut" class="emoji">🧑‍🚀</div>
          <v-card-title id="title">
            <p>Welcome time traveler!</p>
            <p>Would you like to get an introduction?</p>
          </v-card-title>
        </div>
        <v-card-actions>
          <v-btn block color="primary" @click="startIntroduction()"
            >Take the tour</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-slide-y-transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Step from "@/components/introduction/step.vue";

export default Vue.extend({
  name: "Introduction",

  components: {
    Step
  },

  data() {
    return {
      overlay: false,
      step: 0
    };
  },

  methods: {
    startIntroduction() {
      this.overlay = true;
      this.step = 1;
    },

    stopIntroduction() {
      this.overlay = false;
    }
  }
});
</script>

<style lang="scss" scoped>
#container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
}

#dialog {
  flex: 0 0 auto;
  align-self: center;
  justify-self: center;
  padding: 24px;
  max-width: 400px;
  max-height: 300px;
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
  position: relative;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
}
</style>
