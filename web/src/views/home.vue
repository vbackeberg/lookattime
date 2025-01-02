<template>
  <div class="home">
    <PreventMobileDialog v-model="isMobile"></PreventMobileDialog>
    <Timeline v-if="privacyPolicyAgreed" ref="timelineElement"></Timeline>
    <PrivacyPolicyDialog v-model:show="showPrivacyPolicyDialog" @setPrivacyPolicyAgreed="onSetPrivacyPolicyAgreed" />
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
import Timeline from "@/components/timeline/timeline.vue";
import PrivacyPolicyDialog from "@/components/privacy-policy-dialog.vue";
import PreventMobileDialog from "@/components/prevent-mobile-dialog.vue";
import { ref, computed } from "vue";

const store = useLookAtTime();

const privacyPolicyAgreed = ref(false);
const privacyPolicyDisagreed = ref(false);
const showPrivacyPolicyDialog = computed(() => !privacyPolicyAgreed.value)

privacyPolicyAgreed.value = window.localStorage.getItem("privacyPolicyAgreed") === "true";

const isMobile = navigator.maxTouchPoints > 1;

function onSetPrivacyPolicyAgreed(value: boolean) {
  privacyPolicyAgreed.value = value;
  privacyPolicyDisagreed.value = !value;
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
