<template>
  <div class="home">
    <prevent-mobile-dialog v-model="isMobile"></prevent-mobile-dialog>
    <timeline v-if="privacyPolicyAgreed" ref="timelineElement"></timeline>
    <privacy-policy-dialog
      v-model="showPrivacyPolicyDialog"
      @setPrivacyPolicyAgreed="onSetPrivacyPolicyAgreed"
    ></privacy-policy-dialog>
    <div v-if="privacyPolicyDisagreed">
      <p>
        Sorry, you can only use this service after agreeing to the privacy
        policy.
      </p>
      <p>
        <router-link to="/privacy-policy">
          Read the privacy policy.</router-link
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Timeline from "@/components/timeline/timeline.vue";
import PreventMobileDialog from "@/components/prevent-mobile-dialog.vue";
import PrivacyPolicyDialog from "@/components/privacy-policy-dialog.vue";

export default Vue.extend({
  name: "Home",

  components: {
    Timeline,
    PreventMobileDialog,
    PrivacyPolicyDialog
  },

  created() {
    this.privacyPolicyAgreed =
      window.localStorage.getItem("privacyPolicyAgreed") === "true"
        ? true
        : false;
    this.showPrivacyPolicyDialog = !this.privacyPolicyAgreed;
  },

  data() {
    return {
      isMobile: navigator.maxTouchPoints > 1,
      showPrivacyPolicyDialog: false,
      privacyPolicyAgreed: false,
      privacyPolicyDisagreed: false
    };
  },

  methods: {
    onSetPrivacyPolicyAgreed(value: boolean) {
      this.privacyPolicyAgreed = value;
      this.privacyPolicyDisagreed = !value;
    }
  }
});
</script>

<style scoped lang="scss">
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
</style>
