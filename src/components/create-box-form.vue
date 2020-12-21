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
              <v-text-field label="Title" required />
              <v-text-field
                label="Importance"
                required
                type="number"
                v-model.number="importance"
              />
            </v-col>
            <v-col cols="12" sm="6" align-self="center">
              <v-file-input
                accept="image/*"
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
import BoxCreator from "@/timeline/box-creator";

export default Vue.extend({
  name: "CreateBoxForm",

  data() {
    return {
      date: 1516,
      text: "",
      importance: 100,
      images: [] as File[]
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
      BoxCreator.Instance.addBox(
        this.text,
        this.date,
        this.importance,
        this.images
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
