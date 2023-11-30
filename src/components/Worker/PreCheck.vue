<template>
  <div class="flex column q-gutter-md q-pa-lg">
    <q-checkbox
      size="lg"
      class="text-h6"
      v-model="report.民眾在家"
      label="民眾在家"
      dense
    />
    <q-card flat bordered class="">
      <q-card-section class="text-h6 q-pb-none">基本資料</q-card-section>
      <q-card-section class="column q-gutter-md">
        <template v-for="item of infoItems">
          <template v-if="item.type == 'checkbox'">
            <q-checkbox
              size="lg"
              class="text-h6"
              v-model="report[item.key]"
              :label="item.key"
              dense
            />
          </template>
          <template v-if="item.type == 'input'">
            <q-input
              outlined
              :label="item.key"
              v-model.number="report[item.key]"
              class="text-h6"
              :type="item.inputType"
              clearable
            ></q-input>
          </template>
        </template>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="">
      <q-card-section class="text-h6 q-pb-none">注意事項</q-card-section>
      <q-card-section class="column q-gutter-md">
        <template v-for="item of noteItems">
          <template v-if="item.type == 'checkbox'">
            <q-checkbox
              size="lg"
              class="text-h6"
              v-model="report[item.key]"
              :label="item.key"
              dense
            />
          </template>
          <template v-if="item.type == 'input'">
            <q-input
              outlined
              :label="item.key"
              v-model.number="report[item.key]"
              class="text-h6"
              :type="item.inputType"
              clearable
            ></q-input>
          </template>
        </template>
        <Note></Note>
      </q-card-section>
    </q-card>

    <q-input
      outlined
      label="貼單備註"
      v-model="report.note"
      class="text-h6 my-note"
      type="textarea"
      autogrow
    ></q-input>

    <Photo></Photo>
    <div class="text-center">
      <q-checkbox
        size="lg"
        class="text-h6"
        v-model="report.完成"
        :class="report.完成 ? 'text-primary' : 'text-red'"
        :color="report.完成 ? 'primary' : 'red'"
        :keep-color="true"
        label="貼單完成"
        dense
      />
    </div>
  </div>
</template>

<script setup>
import Store from "stores/default";
import { useQuasar } from "quasar";
import Note from "components/Common/Note.vue";
import Photo from "components/Common/Photo.vue";

const $q = useQuasar();
const store = Store();

const report = store.target.report.preCheck;

["完成", "民眾在家"].forEach((item) => {
  report[item] = report[item] || false;
});

const noteItems = [
  { key: "分租套房", type: "checkbox" },
  { key: "有寵物", type: "checkbox" },
  { key: "有臥病病患", type: "checkbox" },
  { key: "有到過疫區", type: "checkbox" },
  { key: "14天內有出國", type: "checkbox" },
  { key: "外籍人士", type: "checkbox" },
];

const infoItems = [
  { key: "聯繫電話", type: "input", inputType: "number" },
  { key: "家戶人數", type: "input", inputType: "number" },
  { key: "有症狀人數", type: "input", inputType: "number" },
  { key: "今年噴藥次數", type: "input", inputType: "number" },
  { key: "有地下室", type: "checkbox" },
  { key: "有倉庫", type: "checkbox" },
];
[...noteItems, ...infoItems].forEach((item) => {
  report[item.key] = report[item.key] || (item.type == "input" ? "" : false);
});
</script>

<style></style>
