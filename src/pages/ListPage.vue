<template>
  <q-page class="flex column q-gutter-md q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col-12 q-pl-none">
        <q-select
          class="text-h6"
          popup-content-class="text-h6"
          size="lg"
          label="場次"
          outlined
          v-model="store.currentSection"
          :options="sections"
          dense
          clearable
        >
          <template v-slot:selected-item="scope">
            <div class="ellipsis" style="width: calc(100vw - 115px)">
              {{ scope.opt.label }}
            </div>
          </template>
        </q-select>
      </div>
      <div class="col-6 q-pl-none">
        <q-select
          class="text-h6"
          popup-content-class="text-h6"
          size="lg"
          label="路"
          outlined
          v-model="store.addressFilter.路"
          :options="[
            null,
            ...groups.路.sort((a, b) => parseInt(a) - parseInt(b)),
          ]"
          dense
          clearable
        />
      </div>
      <div class="col-6">
        <q-select
          class="text-h6"
          popup-content-class="text-h6"
          size="lg"
          label="組別"
          outlined
          v-model="store.addressFilter.組別"
          :options="[
            null,
            ...groups.組別.sort((a, b) => parseInt(a) - parseInt(b)),
          ]"
          dense
          clearable
        />
      </div>
      <div class="col-6 q-pl-none">
        <q-select
          class="text-h6"
          popup-content-class="text-h6"
          label="巷"
          outlined
          v-model="store.addressFilter.巷"
          :options="[
            null,
            ...groups.巷.sort((a, b) => parseInt(a) - parseInt(b)),
          ]"
          dense
          clearable
        />
      </div>

      <div class="col-6">
        <q-select
          class="text-h6"
          popup-content-class="text-h6"
          label="弄"
          outlined
          v-model="store.addressFilter.弄"
          :options="[
            null,
            ...groups.弄.sort((a, b) => parseInt(a) - parseInt(b)),
          ]"
          dense
          clearable
        />
      </div>
      <div class="col-12 q-pl-none">
        <q-input
          class="text-h6"
          label="關鍵字"
          outlined
          v-model="store.addressFilter.關鍵字"
          dense
          clearable
        ></q-input>
      </div>
    </div>
    <q-table
      title-class="q-pa-none q-ma-none"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :rows-per-page-options="[10, 30, 0]"
      table-header-class="td-size"
      @row-click="goWorker"
      :pagination="{
        sortBy: '順序',
        descending: false,
      }"
    >
      <template v-slot:body-cell="props">
        <q-td :props="props" :class="rowColor(props.row.report)">
          {{ props.value }}
          <template v-if="props.col.name == '地址' && props.row.new">
            <q-icon
              class="q-pb-xs"
              color="green-7"
              size="sm"
              name="bookmark_add"
            ></q-icon>
          </template>
        </q-td>
        <q-menu touch-position context-menu class="text-h6">
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="btnUpdate(props.row)">
              <q-item-section>編輯</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="btnCopy(props.row)">
              <q-item-section>複製</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="btnRemove(props.row)">
              <q-item-section>刪除</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
    </q-table>

    <!-- <q-dialog v-model="dialogAction" full-width>
      <q-card>
        <q-card-section class="text-h6 text-center">
          {{ store.getAddress(selectedRow) }}
        </q-card-section>

        <q-card-actions>
          <div class="row full-width q-col-gutter-sm q-pr-sm">
            <div class="col-4">
              <q-btn
                class="full-width"
                size="lg"
                label="刪除"
                color="red-5"
                @click="btnRemove"
              />
            </div>
            <div class="col-4">
              <q-btn
                class="full-width"
                size="lg"
                label="編輯"
                color="green-6"
                @click="btnUpdate"
              />
            </div>
            <div class="col-4">
              <q-btn
                class="full-width"
                size="lg"
                label="複製"
                color="orange-5"
                @click="btnCopy"
              />
            </div>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <q-dialog v-model="dialogCopy" full-width>
      <q-card>
        <q-card-section class="text-h6">
          {{ cloneRow._id ? "編輯" : "複製" }}地址
        </q-card-section>
        <q-card-section class="text-h6 column q-gutter-sm">
          <q-input
            label="區別"
            v-model="cloneRow.區別"
            outlined
            class="text-h6"
          ></q-input>
          <q-input
            label="里別"
            v-model="cloneRow.里別"
            outlined
            class="text-h6"
          ></q-input>
          <q-input
            label="路"
            v-model="cloneRow.路"
            outlined
            class="text-h6"
          ></q-input>
          <q-input
            label="巷"
            v-model="cloneRow.巷"
            outlined
            class="text-h6"
          ></q-input>
          <q-input
            label="弄"
            v-model="cloneRow.弄"
            outlined
            class="text-h6"
          ></q-input>
          <q-input
            label="號、或其他描述"
            v-model="cloneRow.號"
            outlined
            class="text-h6"
          ></q-input>
          <q-input
            label="組別"
            v-model="cloneRow.組別"
            outlined
            class="text-h6"
          ></q-input>
          <q-input
            label="順序"
            v-model="cloneRow.順序"
            outlined
            class="text-h6"
          ></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            size="lg"
            label="取消"
            color="red-5"
            @click="dialogCopy = false"
          />
          <q-btn
            flat
            size="lg"
            label="確認"
            color="primary"
            @click="copyAddress"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogPIN" persistent>
      <q-card>
        <q-card-section>
          <q-input
            class="text-h6"
            v-model="store.PIN"
            type="number"
            outlined
            label="請輸入場次 PIN 碼"
            clearable
          ></q-input>
        </q-card-section>
        <q-card-actions>
          <q-space></q-space>
          <q-btn
            flat
            size="lg"
            label="取消"
            color="red-5"
            @click="closeDialogPIN"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { api } from "boot/axios";
import Store from "stores/default";
import { useQuasar } from "quasar";
import _ from "lodash";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { asyncComputed } from "@vueuse/core";
import { defaultAddress, addressKey } from "src/configs";
import qConfirm from "src/utils/qConfirm";

const router = useRouter();
const store = Store();
const $q = useQuasar();
// const dialogAction = ref(false);
const dialogCopy = ref(false);
const dialogPIN = ref(false);
const selectedRow = ref(null);
const cloneRow = ref(null);
const forceUpdate = ref(0);

if (!store.worker) {
  router.push("/");
}

if (!store.name || store.signExpired) {
  $q.notify({ color: "red-5", message: "請先執行場次簽到", timeout: 3000 });
  router.replace(`/${store.isSys ? "sys" : ""}`);
}

checkPIN();
watch(() => store.currentSection, checkPIN);
watch(() => store.PIN, checkPIN);
watch(
  () => dialogPIN.value,
  (v) => {
    if (v) {
      store.PIN = "";
    }
  }
);

function closeDialogPIN() {
  store.currentSection = null;
  dialogPIN.value = false;
}

function checkPIN() {
  let section = store.sections.find(
    (o) => o.section == store.currentSection?.label
  );
  dialogPIN.value = section?.PIN && !(store.PIN == section?.PIN);
}

const sections = store.sections
  .filter((o) => !o.hide)
  .map((o) => {
    return {
      label: o.section,
      value: o.section,
    };
  });

const columns = [
  {
    name: "順序",
    align: "center",
    label: "順序",
    field: "順序",
    format: (val, row) => val || "",
    sortable: true,
    classes: "td-size",
    sort: (a, b, rowA, rowB) => {
      return parseInt(a) - parseInt(b);
    },
  },
  {
    name: "地址",
    align: "left",
    label: "地址",
    field: "地址",
    format: (val, row) => store.getAddress(row),
    sortable: true,
    classes: "td-size",
    sort: (a, b) => a.localeCompare(b),
    style: "white-space: break-spaces;",
  },
  {
    name: "路",
    align: "center",
    label: "狀態",
    field: "路",
    format: (val, row) => isDown(row.report),
    sortable: true,
    classes: "td-size",
    sort: (a, b, rowA, rowB) => {
      return isDown(rowA.report) > isDown(rowB.report);
    },
  },
];
const rows = asyncComputed(async () => {
  if (!store.currentSection) return [];

  forceUpdate.value +
    store.addressFilter.路 +
    store.addressFilter.巷 +
    store.addressFilter.弄 +
    store.addressFilter.號 +
    store.addressFilter.組別 +
    store.addressFilter.關鍵字;

  store.address = await store.getSectionAddress(store.currentSection.label);

  let address = _.cloneDeep(store.address);

  if (store.addressFilter.組別) {
    address = address.filter((v) => v.組別 == store.addressFilter.組別);
  }
  if (store.addressFilter.路) {
    address = address.filter((v) => v.路 == store.addressFilter.路);
  }
  if (store.addressFilter.巷) {
    address = address.filter((v) => v.巷 == store.addressFilter.巷);
  }
  if (store.addressFilter.弄) {
    address = address.filter((v) => v.弄 == store.addressFilter.弄);
  }
  if (store.addressFilter.關鍵字) {
    address = address.filter((v) =>
      v.地址.includes(store.addressFilter.關鍵字)
    );
  }
  return address;
});

const groups = computed(() => {
  return {
    路: _.keys(_.groupBy(store.address, "路")).filter(
      (v) => !!v && v != "undefined"
    ),
    巷: _.keys(_.groupBy(store.address, "巷")).filter(
      (v) => !!v && v != "undefined"
    ),
    弄: _.keys(_.groupBy(store.address, "弄")).filter(
      (v) => !!v && v != "undefined"
    ),
    組別: _.keys(_.groupBy(store.address, "組別")).filter(
      (v) => !!v && v != "undefined"
    ),
  };
});

function rowColor(report) {
  switch (true) {
    case report?.spray?.action == "無噴射":
    case report?.spray?.action == "部分噴射":
      return "bg-red-1";
    case report?.spray?.action == "完全噴射" && report?.spray?.完成:
      return "bg-green-1";
    case report?.spray?.完成:
    case report?.preCheck?.完成:
      return "bg-blue-1";
  }
}

function isDown(report) {
  switch (store.worker) {
    case "貼單作業":
      return report?.preCheck?.完成 ? "完成" : "";
    case "孳清噴藥":
      // let 完成 = report?.spray?.完成;
      if (report?.spray?.action == "部分噴射") return "部分噴射";
      if (report?.spray?.action == "無噴射") return "無噴射";
      if (report?.spray?.完成 && report?.spray?.action != "完全噴射")
        return "完成";
      return report?.spray?.完成 ? "滋清完成" : "";
    default:
      return "";
  }
}
// async function openAction(evt, row, index) {
//   selectedRow.value = row;
//   dialogAction.value = true;
// }
async function goWorker(evt, row, index) {
  selectedRow.value = row;
  store.target = await store.getSingleAddress(selectedRow.value._id);
  router.push("/worker");
  return;
}
function btnCopy(row) {
  selectedRow.value = row;
  // dialogAction.value = false;
  dialogCopy.value = true;
  cloneRow.value = _.pick(selectedRow.value, defaultAddress);
}
function btnUpdate(row) {
  selectedRow.value = row;
  // dialogAction.value = false;
  dialogCopy.value = true;
  cloneRow.value = _.cloneDeep(selectedRow.value);
}
async function btnRemove(row) {
  selectedRow.value = row;
  // dialogAction.value = false;
  if (
    await qConfirm({
      message: `確定要刪除${store.getAddress(selectedRow.value)}？`,
      size: "lg",
    })
  ) {
    // dialogAction.value = false;
    await store.deleteAddress(selectedRow.value._id);
    forceUpdate.value++;
    $q.notify(store.getAddress(selectedRow.value) + " 已刪除");
  }
}

async function copyAddress() {
  // cloneRow.value.地址 = store.getAddress(cloneRow.value);
  // store.address.push(cloneRow.value);
  if (!cloneRow.value._id) {
    cloneRow.value.new = true;
  }
  await store.updateAddress(store.currentSection.label, [cloneRow.value]);
  forceUpdate.value++;
  dialogCopy.value = false;
  $q.notify(
    store.getAddress(cloneRow.value) +
      ` 已${cloneRow.value._id ? "編輯" : "複製"}`
  );
}
</script>

<style lang="scss" coped>
.td-size {
  font-size: 16px !important;
  th {
    font-size: 16px !important;
  }
}
</style>
