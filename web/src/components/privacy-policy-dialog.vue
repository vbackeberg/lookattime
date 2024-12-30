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
            Read the privacy policy.</router-link>
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

<script setup lang="ts">
import { computed } from 'vue';

const emits = defineEmits<{
  show: [value: boolean]
  setPrivacyPolicyAgreed: [value: boolean]
}>()
const props = defineProps({ show: Boolean })

const show = computed({
  get: () => props.show,
  set: (value) => emits("show", value)
})

function setPrivacyPolicyAgreed(value: boolean) {
  window.localStorage.setItem("privacyPolicyAgreed", value.toString());
  emits("setPrivacyPolicyAgreed", value);
  show.value = false;
}
</script>

<style scoped lang="scss"></style>
