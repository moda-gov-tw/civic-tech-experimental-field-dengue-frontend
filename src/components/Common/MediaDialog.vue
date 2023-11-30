<template>
  <q-card class="">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">檢視照片</div>
    </q-card-section>
    <q-card-section class="full-section">
      <div class="row q-col-gutter-sm">
        <template v-for="(file, index) in files">
          <div class="col-6 relative-position">
            <q-badge
              class="z-top"
              color="grey-9"
              floating
              transparent
              @click="confirmRemove(file.url)"
            >
              <q-icon size="lg" name="close"></q-icon>
            </q-badge>

            <q-img
              class="cursor-pointer shadow-2"
              height="30vh"
              :src="file.url"
              fit="cover"
              @click="open(file.url)"
            >
              <div
                class="absolute-bottom text-subtitle1 text-center padding-none"
              >
                {{ file.time }}
                <div v-if="file.type">{{ file.type }}</div>
                <div v-if="file.note">{{ file.note }}</div>
              </div>
            </q-img>
          </div>
        </template>
      </div>
    </q-card-section>
    <q-card-actions class="fixed-bottom bg-primary">
      <q-space></q-space>

      <q-btn
        size="lg"
        flat
        class="btn-action text-white"
        @click="emit('close')"
      >
        關閉
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import Store from "stores/default";
import { useQuasar } from "quasar";
import { ref, computed } from "vue";
import _ from "lodash";
import { storeToRefs } from "pinia";
import qConfirm from "src/utils/qConfirm";

const emit = defineEmits(["close"]);
const $q = useQuasar();
const store = Store();

const files = ref(store.target.report.files);

function open(url) {
  window.open(url, "_blank");
}

async function confirmRemove(url) {
  if (
    await qConfirm({
      message: "確定刪除嗎？",
      size: "lg",
    })
  ) {
    let index = _.findIndex(store.target.report.files, (o) => o.url == url);
    store.target.report.files.splice(index, 1);
    store.saveReport("files");
  }
}
</script>

<style lang="scss" scoped>
:deep(.q-card__actions i) {
  padding-left: 10px;
  // padding-right: 10px;
}
.btn-action {
  width: 110px;
}
.full-section {
  min-height: calc(100% - 64px - 40px);
  padding-bottom: 80px;
}
.padding-none {
  padding: 8px !important;
}
</style>
