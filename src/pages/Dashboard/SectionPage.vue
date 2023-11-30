<template>
  <div class="container">
    <div class="text-h6 q-my-md">場次管理</div>
    <div class="q-gutter-md">
      <div class="row q-gutter-md">
        <q-space />
        <q-input dense label="搜尋" outlined v-model="keyword" clearable>
        </q-input>

        <q-btn color="primary" icon="add" @click="addSectionDialog = true">
          增修場次
        </q-btn>
      </div>
      <div class="">
        <q-table
          title-class="q-pa-none q-ma-none"
          :rows="sections"
          :columns="columns"
          row-key="section"
          :rows-per-page-options="[10, 30]"
          :pagination="{
            sortBy: 'date',
            descending: true,
          }"
        >
          <template v-slot:body-cell-PIN="props">
            <q-td :props="props">
              <div v-if="props.row.PIN">{{ props.row.PIN }}</div>
              <q-btn
                v-else
                size="sm"
                color="primary"
                @click="createPIN(props.row)"
              >
                產生
              </q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn
                class="q-mx-xs"
                size="sm"
                color="red-14"
                @click="deleteSection(props.key)"
              >
                刪除
              </q-btn>
              <q-btn
                class="q-mx-xs"
                size="sm"
                color="pink-5"
                @click="resetSection(props.key)"
              >
                重設
              </q-btn>
              <q-btn
                class="q-mx-xs"
                size="sm"
                color="blue-7"
                @click="openReport(props.key)"
              >
                數據
              </q-btn>
              <q-btn
                class="q-mx-xs"
                size="sm"
                color="blue-7"
                @click="openSign(props.key)"
              >
                簽到
              </q-btn>
              <q-btn
                class="q-mx-xs"
                size="sm"
                color="green-7"
                @click="downloadXLSX(props.key)"
              >
                地址
              </q-btn>

              <q-btn
                class="q-mx-xs"
                size="sm"
                color="green-7"
                @click="downloadFile(props.key)"
              >
                照片
              </q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-hide="props">
            <q-td :props="props">
              <q-toggle
                color="red-5"
                :model-value="props.row.hide"
                @update:model-value="toggle($event, props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
  <q-dialog v-model="addSectionDialog" persistent>
    <AddSectionDialog @close="addSectionDialog = false" />
  </q-dialog>
  <q-dialog v-model="reportDialog">
    <ReportDialog :section="selectedSection"></ReportDialog>
  </q-dialog>
  <q-dialog v-model="signDialog" full-width>
    <SignDialog :section="selectedSection"></SignDialog>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import _ from "lodash";
import Store from "stores/default";
import { ref, computed } from "vue";
import { removeSection } from "src/libs/firebase";
import AddSectionDialog from "src/components/Dashboard/AddSectionDialog.vue";
import ReportDialog from "src/components/Dashboard/ReportDialog.vue";
import SignDialog from "src/components/Dashboard/SignDialog.vue";
import qConfirm from "src/utils/qConfirm";

const store = Store();
const $q = useQuasar();
const addSectionDialog = ref(false);
const reportDialog = ref(false);
const signDialog = ref(false);
const selectedSection = ref(null);
const keyword = ref("");

const columns = [
  { name: "section", label: "場次名稱", field: "section", align: "left" },
  { name: "PIN", label: "PIN", field: "PIN", align: "center" },
  { name: "date", label: "場次日期", field: "date", align: "center" },
  { name: "count", label: "場次地址", field: "count", align: "center" },
  { name: "hide", label: "隱藏選項", field: "hide", align: "center" },
  { name: "action", label: "操作", field: "action", align: "center" },
];

const sections = computed(() => {
  let rows = store.sections;
  if (keyword.value) {
    keyword.value = keyword.value.trim();
    rows = rows.filter(
      (row) =>
        row.section.includes(keyword.value) || row.date.includes(keyword.value)
    );
  }
  rows = rows.map((row) => {
    return {
      ...row,
      hide: row.hide || false,
    };
  });
  return rows;
});

async function createPIN(row) {
  row.PIN = Math.floor(1000 + Math.random() * 9000) + "";
  await store.updateSection(row);
}
async function toggle(val, row) {
  row.hide = val;
  _.find(store.sections, { _id: row._id }).hide = val;
  await store.updateSection(row);
}
async function openReport(section) {
  selectedSection.value = section;
  reportDialog.value = true;
}

async function openSign(section) {
  selectedSection.value = section;
  signDialog.value = true;
}

function downloadFile(key) {
  window.open(`${import.meta.env.VITE_API_URL}/section/${key}/files`, "_blank");
}
function downloadXLSX(key) {
  window.open(
    `${import.meta.env.VITE_API_URL}/section/${key}/addresses`,
    "_blank"
  );
}

async function resetSection(key) {
  if (await qConfirm({ message: `確定重設場次「${key}」?` })) {
    await store.resetSection(key);
    await removeSection(key);
    $q.notify("重設完成");
  }
}
async function deleteSection(key) {
  if (await qConfirm({ message: `確定刪除場次「${key}」?` })) {
    await store.deleteSection(key);
    await removeSection(key);
    $q.notify("刪除完成");
  }
}
</script>

<style></style>
