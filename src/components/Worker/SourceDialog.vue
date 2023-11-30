<template>
  <q-card class="">
    <template v-if="step == 0">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">積水容器位置</div>
      </q-card-section>
      <q-card-section class="flex q-gutter-md flex-center full-section">
        <q-btn
          :icon="option.icon"
          v-for="option of sourceOptions"
          :color="
            store.currentSource.source.位置 == option.label
              ? 'deep-orange-5'
              : 'deep-orange-3'
          "
          size="lg"
          class="btn-option"
          @click="
            setSource({
              位置: option.label,
            })
          "
        >
          {{ option.label }}
        </q-btn>
      </q-card-section>
    </template>
    <template v-if="step == 1">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">積水容器種類</div>
      </q-card-section>
      <q-card-section class="flex q-gutter-md flex-center full-section">
        <q-btn
          v-for="(option, index) of itemOptions"
          :color="
            store.currentSource.source.容器 == option
              ? 'deep-orange-5'
              : 'deep-orange-3'
          "
          class="btn-option q-pa-sm"
          @click="
            setSource({
              容器: option,
            })
          "
        >
          <div>
            <div class="text-h4">
              {{ index + 1 }}
            </div>
            <div
              class="flex flex-center"
              style="line-height: 18px; height: 40px"
            >
              {{ option }}
            </div>
          </div>
        </q-btn>
      </q-card-section>
    </template>
    <template v-if="step == 2">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">積水容器狀況</div>
      </q-card-section>
      <q-card-section class="flex column q-gutter-y-md full-section full-width">
        <q-input
          v-model.number="store.currentSource.source.數量"
          outlined
          label="積水容器數量"
          type="number"
          class="text-h6"
          clearable
        ></q-input>
        <q-input
          v-model="store.currentSource.source.容器備註"
          label="容器備註 (選填)"
          class="text-h6 my-note"
          type="textarea"
          autogrow
          outlined
        ></q-input>
        <q-checkbox
          size="lg"
          class="text-h6"
          v-model="store.currentSource.source.清除"
          label="已清除積水容器"
          dense
        />
        <q-btn
          v-if="store.currentSource.source.清除"
          icon="photo_camera"
          size="lg"
          color="amber-8"
          @click="openUploadDialog('積水清除')"
        >
          <div class="q-pl-sm">上傳積水清除紀錄</div>
        </q-btn>
        <q-checkbox
          size="lg"
          class="text-h6"
          v-model="store.currentSource.source.投放乳塊"
          label="積水無法清除，已請小蜜蜂協助投放乳塊"
          dense
        />
        <q-btn
          v-if="store.currentSource.source.投放乳塊"
          icon="photo_camera"
          size="lg"
          color="amber-8"
          @click="openUploadDialog('投放乳塊')"
        >
          <div class="q-pl-sm">上傳投放乳塊紀錄</div>
        </q-btn>

        <q-checkbox
          size="lg"
          class="text-h6"
          v-model="store.currentSource.source.陽性"
          label="檢驗出陽性反應"
          dense
        />
        <template v-if="store.currentSource.source.陽性">
          <q-btn
            icon="photo_camera"
            size="lg"
            color="amber-8"
            @click="openUploadDialog('陽性證明')"
          >
            <div class="q-pl-sm">上傳陽性證明照片</div>
          </q-btn>
          <q-checkbox
            size="lg"
            class="text-h6"
            v-model="store.currentSource.source.開單"
            label="已開立舉發單"
            dense
          />
          <q-btn
            v-if="store.currentSource.source.開單"
            icon="move_up"
            size="lg"
            color="amber-8"
            @click="goLink"
          >
            <div class="q-pl-sm">轉接登防系統開單</div>
          </q-btn>
          <q-btn
            v-if="store.currentSource.source.開單"
            icon="photo_camera"
            size="lg"
            color="amber-8"
            @click="openUploadDialog('舉發單')"
          >
            <div class="q-pl-sm">上傳舉發單照片</div>
          </q-btn>
          <q-input
            v-for="option of positiveInputs"
            v-model.number="store.currentSource.source[option]"
            outlined
            :label="option + '數量'"
            type="number"
            class="text-h6"
            clearable
          ></q-input>
          <q-input
            v-model="store.currentSource.source.陽性備註"
            label="陽性備註 (選填)"
            class="text-h6 my-note"
            type="textarea"
            autogrow
            outlined
          ></q-input>
        </template>
      </q-card-section>
    </template>

    <q-card-actions class="fixed-bottom bg-primary">
      <q-btn
        icon="arrow_back_ios"
        flat
        size="lg"
        class="btn-action text-white"
        @click="back"
      >
        返回
      </q-btn>
      <q-space></q-space>
      <template v-if="step != 2">
        <q-btn
          icon-right="arrow_forward_ios"
          size="lg"
          flat
          class="btn-action text-white"
          @click="step++"
        >
          繼續
        </q-btn>
      </template>
      <template v-else>
        <q-btn
          icon-right="check"
          size="lg"
          flat
          class="btn-action text-white"
          @click="addSource"
        >
          儲存
        </q-btn>
      </template>
    </q-card-actions>
  </q-card>
  <q-dialog v-model="uploadDialog" full-width>
    <UploadDialog
      :type="photoType"
      @close="uploadDialog = false"
    ></UploadDialog>
  </q-dialog>
</template>

<script setup>
import Store from "stores/default";
import { useQuasar } from "quasar";
import { ref } from "vue";
import UploadDialog from "components/Common/UploadDialog.vue";
const emit = defineEmits(["close"]);

const $q = useQuasar();
const store = Store();
const step = ref(0);
const photoType = ref(null);
const uploadDialog = ref(false);

store.currentSource.source.數量 = store.currentSource.source.數量 || 1;

const sourceProps = ["陽性", "清除", "開單", "投放乳塊"];
sourceProps.forEach((prop) => {
  store.currentSource.source[prop] = store.currentSource.source[prop] || false;
});

const sourceOptions = [
  { label: "戶內", icon: "home" },
  { label: "戶外", icon: "park" },
];

const itemOptions = [
  "花瓶",
  "各式底盤",
  "水溝",
  "水塔、冷卻水塔",
  "帆布、塑膠布",
  "桶、缸、甕、盆",
  "保麗龍、箱盤、塑膠籃",
  "馬桶、水箱",
  "杯、瓶、碗、罐、盒",
  "地下室、防空洞",
  "輪胎",
  "其他",
];

const positiveInputs = [
  "埃及斑紋幼蟲",
  "白線斑紋幼蟲",
  "埃及斑紋成蟲",
  "白線斑紋成蟲",
  "蛹數",
];

function openUploadDialog(type) {
  photoType.value = type;
  uploadDialog.value = true;
}

function setSource(payload) {
  store.currentSource.source = { ...store.currentSource.source, ...payload };
  step.value = step.value + 1;
}

function back() {
  if (step.value == 0) {
    emit("close");
  }
  step.value = step.value - 1;
}

function addSource() {
  if (store.currentSource.index != null) {
    store.target.report.spray.積水容器[store.currentSource.index] =
      store.currentSource.source;
  } else {
    store.target.report.spray.積水容器.push(store.currentSource.source);
  }
  emit("close");
}

function goLink() {
  window.open("https://dengue.tainan.gov.tw/denguemainsystem", "_blank");
}
</script>

<style lang="scss" scoped>
:deep(.q-card__actions i) {
  padding-left: 10px;
  // padding-right: 10px;
}
.btn-option {
  width: 100px;
  height: 100px;
}
.btn-action {
  width: 110px;
}
.full-section {
  min-height: calc(100% - 64px - 40px);
  padding-bottom: 80px;
}
</style>
