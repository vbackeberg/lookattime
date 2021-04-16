<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title>
        Share your timeline
      </v-card-title>

      <v-card-text>
        <p>
          Everyone who receives this link will be able to view your timeline,
          but not edit it.
        </p>

        <v-text-field
          outlined
          filled
          readonly
          v-model="shareTimelineUrl"
          :append-icon="copied ? 'mdi-check' : 'mdi-content-copy'"
          @click:append="writeToClipboard()"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="show = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import store from "@/store/store";
import Vue from "vue";

export default Vue.extend({
  name: "ShareDialog",

  props: {
    value: Boolean
  },

  data() {
    return {
      copied: false
    };
  },

  computed: {
    show: {
      get(): boolean {
        return this.value;
      },
      set(value: boolean) {
        this.$emit("input", value);
        this.reset(value);
      }
    },

    shareTimelineUrl(): string {
      return (
        process.env.VUE_APP_BASE_URL +
        "/?timeline=" +
        store.state.selectedTimeline.id
      );
    }
  },

  methods: {
    async writeToClipboard() {
      await navigator.clipboard.writeText(this.shareTimelineUrl);
      this.copied = true;
    },

    reset(value: boolean) {
      if (!value) {
        this.copied = false;
      }
    }
  }
});
</script>

<style scoped lang="scss"></style>
