<template>
  <v-dialog v-model="show" persistent max-width="600">
    <v-card>
      <v-card-title class="headline justify-center">
        Create your new event
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Year"
                required
                type="number"
                v-model.number="date"
              />
              <v-text-field
                label="Title"
                required
                type="text"
                v-model="title"
              />
              <v-text-field
                label="Importance"
                required
                type="number"
                v-model.number="importance"
              />
            </v-col>
            <v-col cols="12" sm="6" align-self="center">
              <v-file-input
                accept="image/jpeg, image/gif, image/png, image/svg+xml"
                outlined
                small-chips
                multiple
                label="Add images"
                v-model="images"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Text"
                required
                auto-grow
                outlined
                type="text"
                v-model="text"
              /> </v-col
          ></v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click.stop="back()">
          Back
        </v-btn>
        <v-btn color="primary" @click.stop="create()">
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import TimeEventCreator from "@/timeline/time-event-creator";

export default Vue.extend({
  name: "CreateTimeEventForm",

  data() {
    return {
      date: 1516,
      text: "",
      title: "",
      importance: 100,
      imageids: [1, 6] as number[],
      images: [] as File[] //TODO remove when implementing image upload
    };
  },

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
    create() {
      TimeEventCreator.Instance.addTimeEvent(
        this.text,
        this.date,
        this.importance,
        this.imageids,
        this.title
      );
      this.show = false;
    },

    back() {
      this.show = false;
    }
  }
});
</script>

<style lang="scss"></style>
