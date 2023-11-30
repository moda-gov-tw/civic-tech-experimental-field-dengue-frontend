<template>
  <div class="flex column q-gutter-md q-pa-lg">
    <q-card flat bordered class="">
      <q-card-section class="text-h6 q-pb-none">
        貼單註記的注意事項
      </q-card-section>
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

    <q-card flat bordered class="">
      <q-card-section class="text-h6 q-pb-none"> 現場狀況 </q-card-section>
      <q-card-section class="column q-gutter-md">
        <q-input
          outlined
          label="噴藥人員姓名"
          v-model="report.噴藥人員"
          class="text-h6 bg-red-1"
          clearable
        ></q-input>
        <q-input
          outlined
          label="衛教人數"
          v-model.number="report.衛教人數"
          class="text-h6 bg-red-1"
          type="number"
          clearable
        ></q-input>
        <q-checkbox
          size="lg"
          class="text-h6"
          v-model="report.執行開鎖"
          label="執行開鎖"
          dense
        />
        <template v-if="report.執行開鎖">
          <q-select
            outlined
            label="鎖匠姓名"
            v-model.number="report.鎖匠姓名"
            :options="鎖匠"
            class="text-h6 q-pb-xs"
            popup-content-class="text-h6"
            clearable
          ></q-select>
          <q-select
            outlined
            label="員警姓名"
            :options="員警"
            v-model.number="report.員警姓名"
            class="text-h6"
            popup-content-class="text-h6"
            clearable
          ></q-select>
          <q-btn
            class="q-mt-md"
            icon="photo_camera"
            size="lg"
            color="amber-8"
            @click="openUploadDialog('開鎖記錄')"
          >
            <div class="q-pl-sm">上傳開鎖記錄</div>
          </q-btn>
        </template>
        <q-checkbox
          size="lg"
          class="text-h6"
          v-model="report.無法開鎖"
          label="無法開鎖"
          dense
        />
        <q-checkbox
          size="lg"
          class="text-h6"
          v-model="report.執行壓罐"
          label="執行壓罐"
          dense
        />
        <template v-if="report.執行壓罐">
          <q-input
            outlined
            label="壓罐數量"
            v-model.number="report.壓罐數量"
            class="text-h6 q-pb-xs"
            type="number"
            clearable
          ></q-input>
        </template>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="">
      <q-card-section class="text-h6 q-pb-none"> 孳清狀況 </q-card-section>
      <q-card-section class="column q-gutter-md">
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
      </q-card-section>
    </q-card>

    <q-card flat bordered class="">
      <q-card-section class="text-h6 q-pb-none"> 化噴狀況 </q-card-section>
      <q-card-section class="q-gutter-md q-pb-none">
        <div class="">
          <q-btn-toggle
            clearable
            v-model="report.action"
            :options="actionOptions"
            spread
            no-caps
            toggle-color="primary"
            size="18px"
            padding="10px 10px"
          ></q-btn-toggle>

          <template v-if="report.action == '完全噴射'">
            <q-option-group
              class="text-h6 q-pl-lg q-gutter-sm q-mt-lg"
              size="lg"
              dense
              v-model="report.type"
              :options="sprayType"
              color="primary"
            >
              <template v-slot:label="opt">
                <div :class="report.type == opt.value ? 'text-primary' : ''">
                  {{ opt.label }}
                </div>
              </template>
            </q-option-group>
          </template>
          <template v-if="report.action == '部分噴射'">
            <q-btn
              class="full-width q-mt-md"
              icon="photo_camera"
              size="lg"
              color="amber-8"
              @click="openUploadDialog('補噴單')"
            >
              <div class="q-pl-sm">上傳補噴單</div>
            </q-btn>
          </template>
          <template v-if="report.action == '無噴射'">
            <q-option-group
              class="text-h6 q-pl-lg q-gutter-sm q-mt-lg"
              size="lg"
              dense
              v-model="report.fail"
              :options="failType"
              color="red-5"
            >
              <template v-slot:label="opt">
                <div :class="report.fail == opt.value ? 'text-red-5' : ''">
                  {{ opt.label }}
                </div>
              </template>
            </q-option-group>
            <q-btn
              class="full-width q-mt-md"
              icon="photo_camera"
              size="lg"
              color="amber-8"
              @click="openUploadDialog('補噴單')"
            >
              <div class="q-pl-sm">上傳補噴單</div>
            </q-btn>
          </template>
        </div>
      </q-card-section>
    </q-card>

    <div class="text-center">
      <q-checkbox
        size="lg"
        class="text-h6"
        v-model="report.完成"
        :class="report.完成 ? 'text-primary' : 'text-red'"
        :color="report.完成 ? 'primary' : 'red'"
        :keep-color="true"
        label="孳清噴藥作業結束"
      />
    </div>
    <Photo></Photo>
    <q-dialog
      v-model="sourceDialog"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <SourceDialog @close="sourceDialog = false"></SourceDialog
    ></q-dialog>
    <q-dialog v-model="uploadDialog" full-width>
      <UploadDialog
        :type="photoType"
        @close="uploadDialog = false"
      ></UploadDialog>
    </q-dialog>
  </div>
</template>

<script setup>
import Store from "stores/default";
import { useQuasar } from "quasar";
import { ref, computed } from "vue";
import _ from "lodash";
import Note from "components/Common/Note.vue";
import Photo from "components/Common/Photo.vue";
import SourceDialog from "components/Worker/SourceDialog.vue";
import UploadDialog from "components/Common/UploadDialog.vue";
import { watchSupport } from "src/libs/firebase";
import qConfirm from "src/utils/qConfirm";

const $q = useQuasar();
const store = Store();
const sourceDialog = ref(false);
const uploadDialog = ref(false);
const photoType = ref(null);
const support = ref(null);
let stopWatch = ref(() => {});

const report = store.target.report.spray;
const preCheckReport = store.target.report.preCheck;

report.完成 = report.完成 || false;
report.執行開鎖 = report.執行開鎖 || false;
report.執行壓罐 = report.執行壓罐 || false;
report.無法開鎖 = report.無法開鎖 || false;
report.噴藥人員 = report.噴藥人員 || store.sprayHelper;

const 員警 = computed(() =>
  _.filter(support.value, (o) => o.role == "員警").map((o) => ({
    label: o.name,
    value: o.name,
  }))
);
const 鎖匠 = computed(() =>
  _.filter(support.value, (o) => o.role == "鎖匠").map((o) => ({
    label: o.name,
    value: o.name,
  }))
);

const noteItems = [
  { key: "分租套房", type: "checkbox" },
  { key: "有寵物", type: "checkbox" },
  { key: "有臥病病患", type: "checkbox" },
  { key: "有到過疫區", type: "checkbox" },
  { key: "14天內有出國", type: "checkbox" },
  { key: "外籍人士", type: "checkbox" },
];
const isNote = _.some(noteItems.map((o) => preCheckReport?.[o.key] || false));

const positiveInputs = [
  "埃及斑紋幼蟲",
  "白線斑紋幼蟲",
  "埃及斑紋成蟲",
  "白線斑紋成蟲",
  "蛹數",
];

const actionOptions = ["完全噴射", "部分噴射", "無噴射"].map((item) => ({
  label: item,
  value: item,
}));
const sprayType = ["一般", "不在戶", "空戶", "空地", "其他"].map((item) => ({
  label: item,
  value: item,
}));
const failType = ["⺠眾拒絕", "不在戶(無法開鎖)", "空戶(無法開鎖)", "其他"].map(
  (item) => ({
    label: item,
    value: item,
  })
);

handleWatchSupport(store.currentSection);

function handleWatchSupport(section) {
  stopWatch.value();
  if (section && section.label) {
    stopWatch.value = watchSupport(section.label, (data) => {
      support.value = data || null;
    });
  }
}

function openUploadDialog(type) {
  photoType.value = type;
  uploadDialog.value = true;
}

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

<style lang="scss" scoped>
.pl {
  padding-left: 13px;
}
</style>
