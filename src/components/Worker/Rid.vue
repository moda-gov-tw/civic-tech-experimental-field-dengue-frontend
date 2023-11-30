<template>
  <div class="flex column q-gutter-md q-pa-lg">
    <q-card flat bordered class="">
      <q-card-section class="text-h6 q-pb-none">注意事項</q-card-section>
      <q-card-section class="column q-gutter-md">
        <template v-if="isNote">
          <ul class="q-pl-lg">
            <template v-for="item of noteItems">
              <template v-if="preCheckReport[item.key]">
                <li class="text-h6">{{ item.key }}</li>
              </template>
            </template>
          </ul>
        </template>
        <template v-else>
          <div class="text-subtitle1">無</div>
        </template>
        <Note></Note>
      </q-card-section>
    </q-card>

    <q-checkbox
      size="lg"
      class="text-h6"
      v-model="report.執行開鎖"
      label="執行開鎖"
      dense
    />
    <template v-if="report.執行開鎖">
      <q-input
        outlined
        label="鎖匠姓名"
        v-model.number="report.鎖匠姓名"
        class="text-h6 q-pb-xs"
        clearable
      ></q-input>
      <q-input
        outlined
        label="員警姓名"
        v-model.number="report.員警姓名"
        class="text-h6"
        clearable
      ></q-input>
    </template>

    <q-btn size="lg" color="primary" icon="add" @click="addSource">
      <div class="q-pl-sm">記錄積水容器</div>
    </q-btn>
    <template v-for="(item, n) of report.積水容器">
      <q-card :class="item.陽性 ? 'bg-red-1' : 'bg-light-green-1'">
        <q-card-section class="text-h6 q-py-sm">
          {{ item.容器 }} ({{ item.位置 }}) x {{ item.數量 }}
        </q-card-section>
        <q-input
          v-if="item.容器備註"
          v-model="item.容器備註"
          label="容器備註"
          class="text-subtitle1 my-note q-px-md q-mb-sm"
          type="textarea"
          autogrow
          outlined
          readonly
        ></q-input>
        <q-card-section v-if="item.陽性" class="text-subtitle1 q-py-none">
          <template v-for="positive of positiveInputs">
            <div v-if="item[positive]">
              {{ positive }} x {{ item[positive] }}
            </div>
          </template>
          <q-input
            v-if="item.陽性備註"
            v-model="item.陽性備註"
            label="陽性備註"
            class="text-subtitle1 my-note q-mt-sm"
            type="textarea"
            autogrow
            outlined
            readonly
          ></q-input>
        </q-card-section>
        <q-card-actions class="q-py-sm">
          <q-btn
            size="lg"
            flat
            color="negative"
            label="刪除"
            @click="removeSource(n)"
          ></q-btn>
          <q-space></q-space>
          <q-btn
            size="lg"
            color="primary"
            label="修改"
            flat
            @click="
              store.currentSource = {
                source: item,
                index: n,
              };
              sourceDialog = true;
            "
          ></q-btn>
        </q-card-actions>
      </q-card>
    </template>
    <q-input
      outlined
      label="孳清備註"
      v-model="report.note"
      class="text-h6 my-note"
      type="textarea"
      autogrow
    ></q-input>

    <Photo></Photo>
    <q-checkbox
      size="lg"
      class="text-h6"
      v-model="report.完成"
      :class="report.完成 ? 'text-primary' : 'text-red'"
      :color="report.完成 ? 'primary' : 'red'"
      :keep-color="true"
      label="孳清噴藥作業結束"
      dense
    />
    <q-dialog
      v-model="sourceDialog"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <SourceDialog @close="sourceDialog = false"></SourceDialog
    ></q-dialog>
  </div>
</template>

<script setup>
import Store from "stores/default";
import { useQuasar } from "quasar";
import { ref } from "vue";
import _ from "lodash";
import Note from "components/Common/Note.vue";
import Photo from "components/Common/Photo.vue";
import SourceDialog from "components/Worker/SourceDialog.vue";
import qConfirm from "src/utils/qConfirm";

const $q = useQuasar();
const store = Store();
const sourceDialog = ref(false);

const report = store.target.report.rid;
const preCheckReport = store.target.report.preCheck;

const noteItems = [
  { key: "分租套房", type: "checkbox" },
  { key: "有寵物", type: "checkbox" },
  { key: "有臥病病患", type: "checkbox" },
  { key: "有到過疫區", type: "checkbox" },
  { key: "14天內有出國", type: "checkbox" },
  { key: "外籍人士", type: "checkbox" },
];
const isNote = _.some(noteItems.map((o) => preCheckReport?.[o.key] || false));

report.完成 = report.完成 || false;
report.執行開鎖 = report.執行開鎖 || false;

const positiveInputs = [
  "埃及斑紋幼蟲",
  "白線斑紋幼蟲",
  "埃及斑紋成蟲",
  "白線斑紋成蟲",
  "蛹數",
];

function addSource() {
  sourceDialog.value = true;
  store.currentSource = {
    source: {},
    index: null,
  };
}
async function removeSource(n) {
  if (
    await qConfirm({
      message: `確定刪除此記錄？`,
      size: "lg",
    })
  ) {
    report.積水容器.splice(n, 1);
  }
}
</script>

<style></style>
