<template>
  <q-card>
    <q-card-section class="q-gutter-md">
      <q-file
        size="lg"
        v-model="files"
        label="選擇照片"
        outlined
        use-chips
        multiple
        accept=".jpg, .png, .jpeg, .gif, image/*"
      />

      <q-select
        class="text-h6"
        popup-content-class="text-h6"
        size="lg"
        label="照片種類"
        outlined
        v-model="type"
        :options="typeOptions"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label class="q-py-sm">{{ scope.opt }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input
        size="lg"
        outlined
        label="其他備註"
        v-model="note"
        class="text-h6 my-note"
        type="textarea"
        autogrow
      ></q-input>
    </q-card-section>
    <q-card-actions>
      <q-btn size="lg" flat color="red-5" icon="close" @click="cancelUpload">
        取消
      </q-btn>
      <q-space></q-space>
      <q-btn size="lg" flat color="primary" icon="cloud_upload" @click="upload">
        <div class="q-ml-sm">上傳</div>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { api } from "boot/axios";
import Store from "stores/default";
import { useQuasar } from "quasar";
import { ref } from "vue";
import _ from "lodash";
import dayjs from "dayjs";
import { readAndCompressImage } from "browser-image-resizer";

const emit = defineEmits(["close"]);
const props = defineProps(["type", "note"]);
const $q = useQuasar();
const store = Store();

const files = ref(null);
const note = ref(props.note || null);
const type = ref(props.type || null);

let typeOptions = [];

switch (store.worker) {
  case "貼單作業":
    typeOptions = ["貼單記錄", "環境記錄", "其他"];
    break;
  case "孳清噴藥":
    typeOptions = [
      "積水容器",
      "積水清除",
      "投放乳塊",
      "孳生源",
      "陽性證明",
      "開單照片",
      "開鎖紀錄",
      "已噴藥單",
      "補噴單",
      "噴藥紀錄",
      "其他",
    ];
    break;
  case "呼叫順序":
    typeOptions = [];
    break;
}

function cancelUpload() {
  files.value = null;
  note.value = null;
  type.value = null;
  emit("close");
}

async function upload() {
  if (files.value.length === 0) return;
  let previewImgs = [];
  $q.loading.show();
  for await (let o of files.value) {
    let resizedImage = await readAndCompressImage(o, {
      quality: 1,
      maxWidth: 1500,
      maxHeight: 1000,
      mimeType: "image/png",
    });
    let formData = new FormData();
    formData.append("file", resizedImage, "text.png");
    let { data } = await api({
      method: "post",
      url: "/file",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    previewImgs.push({
      worker: store.worker,
      url: data.url,
      type: type.value,
      note: note.value,
      time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
  }

  $q.loading.hide();
  let mergeFiles = [...store.target.report.files, ...previewImgs];
  store.target.report.files = mergeFiles;
  store.saveReport("files");
  $q.notify("上傳成功");
  cancelUpload();
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
