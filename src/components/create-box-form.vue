<template>
  <v-dialog v-model="show" persistent max-width="600">
    <v-card>
      <v-card-title class="headline">
        Create a new event
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field label="Title" required />
            </v-col>
            <v-col cols="12" sm="6">
              <v-icon />
            </v-col>
            <v-col cols="12"> <v-text-field label="Text" required /> </v-col
          ></v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click.stop="back()">
          Back
        </v-btn>
        <v-btn color="primary" text @click.stop="show = false">
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import BoxCreator from "@/timeline/box-creator";
import BoxModel from "@/models/box-model";

export default Vue.extend({
  name: "CreateBoxForm",

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
      this.addBox();
      this.show = false;
    },

    addBox() {
      const box = new BoxModel();

      BoxCreator.Instance.addBox(box);
    },

    back() {
      this.show = false;
    }
  }
});
</script>

<style lang="scss"></style>
