<template>
  <v-dialog v-model="show" persistent max-width="600">
    <v-card>
      <v-card-title>
        Hi traveler! 👩‍🚀
      </v-card-title>
      <v-card-text class="card-text">
        <p>
          It looks like you are visiting from a phone or tablet.
        </p>
        <p>
          This site is made for large screens and needs a mouse wheel or
          Touchpad to work well.
        </p>
        <p>
          Visit
          <a href="https://www.lookattime.com">lookattime.com</a> from your
          desktop or laptop.
        </p>
        <p>
          Or take a look behind the curtain
          <a href="https://valerianb.medium.com">on my blog</a>.
        </p></v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="show = false">
          Okay!
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PreventMobileDialog",

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
  }
});
</script>

<style scoped lang="scss">
.card-text {
  font-size: medium;
}

a {
  font-weight: bold;
}
</style>
