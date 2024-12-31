<template>
  <div class="home">
    <prevent-mobile-dialog v-model="isMobile"></prevent-mobile-dialog>
    <timeline v-if="privacyPolicyAgreed" ref="timelineElement"></timeline>
    <privacy-policy-dialog v-model="showPrivacyPolicyDialog"
      @setPrivacyPolicyAgreed="onSetPrivacyPolicyAgreed"></privacy-policy-dialog>
    <div class="privacy-policy-disagreed" v-if="privacyPolicyDisagreed">
      <p>
        Sorry, you can only use this service after agreeing to the privacy
        policy.
      </p>
      <p>
        <router-link to="/privacy-policy">
          Read the privacy policy.</router-link>
      </p>
    </div>
    <introduction v-if="privacyPolicyAgreed && !store.loading && store.showIntroduction"></introduction>
  </div>
</template>

<script setup lang="ts">
import { useLookAtTime } from "@/store/store";
import Introduction from "@/components/introduction/introduction.vue";
import preventMobileDialog from "@/components/prevent-mobile-dialog.vue";
import timeline from "@/components/timeline/timeline.vue";
import privacyPolicyDialog from "@/components/privacy-policy-dialog.vue";

const store = useLookAtTime();

let privacyPolicyAgreed = false;
let privacyPolicyDisagreed = false;
let showPrivacyPolicyDialog = false;

privacyPolicyAgreed = window.localStorage.getItem("privacyPolicyAgreed") === "true";
showPrivacyPolicyDialog = !privacyPolicyAgreed;

const isMobile = navigator.maxTouchPoints > 1;

function onSetPrivacyPolicyAgreed(value: boolean) {
  privacyPolicyAgreed = value;
  privacyPolicyDisagreed = !value;
};
</script>

<style scoped lang="css">
.home {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
}

.controls {
  height: 50px;
  width: 100%;
}

.privacy-policy-disagreed {
  padding: 16px;
}
</style>
