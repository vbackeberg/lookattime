<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title class="headline justify-center">
        Select one of your timelines
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-list>
            <v-list-item
              v-for="timeline in timelines"
              :key="timeline.id"
              v-on:click="select(timeline.id)"
            >
              {{ timeline.title }}
            </v-list-item>
            <v-list-item v-on:click="create()">
              Create new timeline</v-list-item
            >
          </v-list>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click.stop="back()">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Database from "@/local-database/database";
import Vue from "vue";
import { v4 as uuid } from "uuid";
import store from "@/store";
import Timeline from "@/api/timeline/timeline";

export default Vue.extend({
  name: "ManageTimelinesForm",

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
    },

    timelines() {
      return store.state.timelines;
    }
  },

  methods: {
    select(id: string) {
      store.dispatch("setSelectedTimelineId", id);

      this.show = false;
    },

    create() {
      const timeline = {
        id: uuid(),
        userId: store.state.userId,
        title: "title"
      } as Timeline;
      Database.Instance.postTimeline(timeline);
      store.dispatch("setSelectedTimelineId", timeline.id);

      this.show = false;
    },

    back() {
      this.show = false;
    }
  }
});
</script>

<style lang="scss"></style>
