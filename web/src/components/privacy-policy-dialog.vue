<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title>
        Privacy Policy
      </v-card-title>

      <v-card-text>
        <p>
          Welcome to Look at Time. In order to use our service, you have to
          agree to our privacy policy.
        </p>
        <p>
          <router-link to="/privacy-policy">
            Read the privacy policy.</router-link
          >
        </p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="setPrivacyPolicyAgreed(true)">
          I agree
        </v-btn>
        <v-btn color="secondary" @click="setPrivacyPolicyAgreed(false)">
          I disagree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PrivacyPolicyDialog",

  props: {
    value: Boolean
  },

  computed: {
    show: {
      get(): boolean {
        return this.value;
      },
      set(value: boolean) {
        this.$emit("input", value);
      }
    }
  },

  methods: {
    setPrivacyPolicyAgreed(value: boolean) {
      window.localStorage.setItem("privacyPolicyAgreed", value.toString());
      this.$emit("setPrivacyPolicyAgreed", value);
      this.show = false;
    }
  }
});
</script>

<style scoped lang="scss"></style>
