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
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" variant="text" @click="show = false">
          Okay!
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const emits = defineEmits({show: Boolean})
const props = defineProps({ show: Boolean })

const show = computed({
  get: () => props.show,
  set: (value) => emits("show", value)
})
</script>

<style scoped lang="css">
.card-text {
  font-size: medium;
}

a {
  font-weight: bold;
}
</style>
