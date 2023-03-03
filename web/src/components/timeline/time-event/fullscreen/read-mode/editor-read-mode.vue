<template>
  <div class="ck-content" v-html="sanitizedHtmlString"></div>
</template>

<script lang="ts">
import Vue from "vue";
import DomPurify from "dompurify";

export default Vue.extend({
  name: "EditorReadMode",

  props: {
    value: String
  },

  computed: {
    sanitizedHtmlString: {
      get(): string {
        return DomPurify.sanitize(this.value); // TODO sanitize in backend before saving.
      }
    }
  },

  methods: {},

  components: {}
});
</script>

<style lang="scss" scoped></style>
