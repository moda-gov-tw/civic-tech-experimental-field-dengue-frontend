<template>
  <q-input
    outlined
    label="其他注意事項"
    v-model="store.target.report.note"
    class="text-h6 my-note"
    type="textarea"
    readonly
    autogrow
    @click="editNote"
  ></q-input>
</template>

<script setup>
import Store from "stores/default";
import { useQuasar } from "quasar";

const $q = useQuasar();
const store = Store();

function editNote() {
  $q.dialog({
    title: "編輯其他注意事項",
    prompt: {
      focus: false,
      model: store.target.report.note,
      type: "textarea",
      class: "text-h6 my-note",
      outlined: true,
      autogrow: true,
    },
    cancel: true,
    persistent: true,
  }).onOk((data) => {
    store.target.report.note = data;
    store.saveReport("note");
  });
}
</script>
<style lang="scss">
.my-note textarea {
  line-height: 30px !important;
}
</style>
