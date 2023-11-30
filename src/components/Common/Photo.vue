<template>
  <q-btn
    icon="photo_camera"
    size="lg"
    color="amber-8"
    @click="uploadDialog = true"
  >
    <div class="q-pl-sm">上傳其他照片</div>
  </q-btn>
  <q-btn
    icon="collections"
    size="lg"
    color="green-5"
    @click="mediaDialog = true"
  >
    <div class="q-pl-sm">檢視照片</div>
  </q-btn>
  <q-dialog v-model="uploadDialog" full-width>
    <UploadDialog @close="uploadDialog = false"></UploadDialog>
  </q-dialog>
  <q-dialog
    v-model="mediaDialog"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <MediaDialog @close="mediaDialog = false"></MediaDialog
  ></q-dialog>
</template>

<script setup>
import Store from "stores/default";
import { ref, computed } from "vue";
import { useQuasar } from "quasar";

import MediaDialog from "components/Common/MediaDialog.vue";
import UploadDialog from "components/Common/UploadDialog.vue";

const $q = useQuasar();
const store = Store();

const uploadDialog = ref(false);
const mediaDialog = ref(false);
</script>

<style></style>
