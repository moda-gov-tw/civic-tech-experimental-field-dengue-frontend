<template>
  <div class="container">
    <div class="text-h6 q-my-md">綜合搜尋</div>
    <div class="row q-col-gutter-md">
      <div class="col-4">
        <q-select
          use-input
          size="lg"
          label="場次"
          outlined
          v-model="selectedSection"
          input-debounce="0"
          :options="filterSections"
          @filter="filterFn"
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> 沒有符合場次 </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-3">
        <q-input
          label="關鍵字 (地址、姓名)"
          outlined
          v-model="keyword"
          clearable
        >
        </q-input>
      </div>
      <div class="col q-gutter-md flex items-center">
        <q-checkbox
          class="text-subtitle1"
          size="lg"
          label="開鎖"
          v-model="condition.開鎖"
        ></q-checkbox>
        <q-checkbox
          class="text-subtitle1"
          size="lg"
          label="陽性"
          v-model="condition.陽性"
        ></q-checkbox>
        <q-checkbox
          class="text-subtitle1"
          size="lg"
          label="補噴"
          v-model="condition.補噴"
        ></q-checkbox>
      </div>
      <div class="col-auto flex items-center">
        <q-btn
          v-if="searchResult.length"
          class="q-mr-md"
          color="orange-7"
          padding="8px 20px"
        >
          <JsonExcel :data="excelData" type="xlsx" :name="`搜尋結果`">
            匯出
          </JsonExcel>
        </q-btn>
        <q-btn color="primary" padding="8px 20px" @click="search">搜尋</q-btn>
      </div>
    </div>
    <div class="q-mt-md">
      <q-table
        :rows="searchResult"
        :columns="columns"
        row-key="section"
        :rows-per-page-options="[10, 30, 0]"
      >
        <template v-slot:body-cell-標籤="props">
          <q-td class="text-center">
            <q-chip
              color="orange-6"
              dark
              v-if="is('開鎖', props.row)"
              size="13px"
              :ripple="false"
            >
              開鎖
            </q-chip>
            <q-chip
              color="red-6"
              dark
              v-if="is('陽性', props.row)"
              size="13px"
              :ripple="false"
            >
              陽性
            </q-chip>
            <q-chip
              color="deep-purple-4"
              dark
              v-if="is('補噴', props.row)"
              size="13px"
              :ripple="false"
            >
              補噴
            </q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-地址="props">
          <q-td
            class="text-left underline cursor-pointer"
            @click="openSpray(props.row)"
          >
            {{ props.value }}
          </q-td>
        </template>
        <template v-slot:body-cell-照片="props">
          <q-td class="text-center">
            <span
              class="cursor-pointer underline"
              @click="openImageDialog(props.row)"
            >
              {{ props.row.report?.files?.length || "" }}
            </span>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="imageDialog">
      <ImageDialog
        :files="selectedRow.report.files"
        @close="imageDialog = false"
      ></ImageDialog>
    </q-dialog>
    <q-dialog v-model="sprayDialog">
      <SprayDialog
        @close="sprayDialog = false"
        @save="
          sprayDialog = false;
          search();
        "
      ></SprayDialog>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Store from "stores/default";
import { useQuasar } from "quasar";
import _ from "lodash";
import JsonExcel from "vue-json-excel3";
import { api } from "boot/axios";
import ImageDialog from "components/Dashboard/ImageDialog.vue";
import SprayDialog from "components/Dashboard/SprayDialog.vue";

const $q = useQuasar();
const store = Store();
const selectedSection = ref(null);
const keyword = ref(null);
const searchResult = ref([]);
const selectedRow = ref(null);
const imageDialog = ref(false);
const sprayDialog = ref(false);
const excelData = computed(() => {
  return searchResult.value.map((row) => {
    return {
      日期: row.日期,
      場次: row.場次,
      地址: row.地址,
      滋清噴射: row.report?.spray?.完成 || false ? "完成" : "",
      噴射狀態: actionText(row.report),
      開鎖: row.report?.spray?.執行開鎖 || false ? "V" : "",
      陽性: _.some(row.report?.spray?.積水容器, { 陽性: true }) ? "V" : "",
      補噴:
        row.report?.spray?.action == "部分噴射" ||
        row.report?.spray?.action == "無噴射"
          ? "V"
          : "",
      照片數: row.report?.files?.length || "",
      最後異動人: row.report?.spray?.reporter || "",
    };
  });
});

const condition = ref({
  開鎖: false,
  陽性: false,
  補噴: false,
});

const columns = [
  { name: "場次", label: "場次", field: "場次", align: "left" },
  { name: "地址", label: "地址", field: "地址", align: "left" },
  {
    name: "report.spray.完成",
    label: "滋清噴射",
    field: "report",
    align: "center",
    sortable: true,
    format: (val, row) => {
      return val?.spray?.完成 || false ? "完成" : "";
    },
    sort: (x, y) => Number(x.spray?.完成) - Number(y.spray?.完成),
  },
  {
    name: "report.spray.action",
    label: "噴射狀態",
    field: "report",
    align: "center",
    sortable: true,
    format: (val, row) => {
      return actionText(val);
    },
    sort: (a, b) => {
      let stringA = a.spray?.action || "";
      let stringB = b.spray?.action || "";
      return stringA.localeCompare(stringB);
    },
  },
  { name: "標籤", label: "標籤", field: "標籤", align: "center" },
  {
    name: "照片",
    label: "照片數",
    field: "照片",
    align: "center",
  },
];

const sections = store.sections.map((o) => {
  return o.section;
});
sections.reverse();
const filterSections = ref(sections);

function actionText(val) {
  let type = false;
  switch (val?.spray?.type || "") {
    case "其他":
      type = "其他";
      break;
    case "":
      type = "無";
      break;
  }
  let action = val?.spray?.action || "";
  return action + (action == "完全噴射" && !!type ? `(${type})` : "");
}

function openSpray(row) {
  store.target = _.cloneDeep(row);
  sprayDialog.value = true;
}

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    filterSections.value = sections.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
}

function is(type, row) {
  switch (type) {
    case "開鎖":
      return row.report?.spray?.執行開鎖 || false;
    case "陽性":
      return _.some(row.report?.spray?.積水容器, { 陽性: true }) || false;
    case "補噴":
      return (
        row.report?.spray?.action == "部分噴射" ||
        row.report?.spray?.action == "無噴射" ||
        false
      );
  }
}
function openImageDialog(row) {
  imageDialog.value = true;
  selectedRow.value = row;
}

async function search() {
  let data = await store.searchAddress(
    selectedSection?.value,
    keyword.value,
    condition.value
  );
  searchResult.value = data;
}
</script>

<style></style>
