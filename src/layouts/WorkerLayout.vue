<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <Header ref="header"></Header>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab color="amber-8" round @click="callDialog = true">
          <q-icon size="xl" name="campaign"></q-icon>
        </q-btn>
      </q-page-sticky>
      <q-dialog v-model="callDialog" full-width>
        <q-card>
          <q-card-section class="text-h6">呼叫場控支援</q-card-section>
          <q-card-section class="column">
            <template v-for="type of tasks">
              <q-radio
                v-model="task.type"
                class="text-h6"
                size="lg"
                :val="type"
              >
                <div
                  :class="
                    task.type == '小蜜蜂補給' && type == '小蜜蜂補給'
                      ? 'q-pt-sm'
                      : ''
                  "
                >
                  {{ type }}
                </div>
                <div
                  v-if="task.type == '小蜜蜂補給' && type == '小蜜蜂補給'"
                  class="q-gutter-xs q-mt-sm"
                >
                  <q-chip
                    size="lg"
                    v-for="item of Object.keys(task.supply)"
                    v-model:selected="task.supply[item]"
                    color="primary"
                    text-color="white"
                    icon="check_box_outline_blank"
                    icon-selected="check_box"
                  >
                    {{ item }}
                  </q-chip>
                </div>
              </q-radio>
            </template>
            <q-input
              size="lg"
              outlined
              label="呼叫備註"
              v-model="task.note"
              class="text-h6 my-note q-ma-sm q-pt-sm"
              type="textarea"
              autogrow
            ></q-input>
          </q-card-section>
          <q-card-actions>
            <q-btn size="lg" flat color="red-5" @click="callDialog = false">
              取消
            </q-btn>
            <q-space></q-space>
            <q-btn size="lg" flat color="primary">
              <div class="q-ml-sm" @click="callHelp">呼叫</div>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>

    <q-footer class="bg-primary text-white q-pa-sm">
      <q-toolbar class="q-px-none">
        <q-toolbar-title class="flex justify-between">
          <q-btn
            v-if="store.worker != '呼叫順序'"
            flat
            size="lg"
            icon="arrow_back_ios"
            @click="goBack"
          >
            返回
          </q-btn>

          <q-btn
            flat
            size="lg"
            icon-right="check"
            @click="saveReport"
            v-if="store.worker != '呼叫順序'"
          >
            <div class="q-pr-sm">儲存</div>
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<script setup>
import Header from "components/Common/Header.vue";
import Store from "stores/default";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { addTask } from "src/libs/firebase";
import dayjs from "dayjs";
import qConfirm from "src/utils/qConfirm";

const $q = useQuasar();
const router = useRouter();
const store = Store();
const header = ref();

const callDialog = ref(false);
const tasks = ["開鎖(鎖匠+員警)", "員警協助", "小蜜蜂補給", "進度支援", "其他"];

const task = ref({
  type: "",
  note: "",
  supply: {
    噴槍油: false,
    噴槍藥: false,
    殺蟲劑: false,
    壓罐: false,
    乳塊: false,
    水: false,
    筆: false,
  },
});

async function saveReport() {
  if (validateReport() && (await confirmComplete())) {
    await store.saveReport();
    $q.notify("儲存完成");
    goBack();
  }
}

async function confirmComplete() {
  return new Promise(async (done) => {
    if (store.worker != "貼單作業" && store.worker != "孳清噴藥") {
      done(true);
      return;
    }
    if (store.target?.report?.[store.workerKey]?.完成) {
      done(true);
      return;
    }
    done(
      await qConfirm({
        message: `未勾選${store.worker}完成，是否要繼續儲存？`,
        size: "lg",
      })
    );
  });
}

function validateReport() {
  return true;
}

function goBack() {
  switch (store.worker) {
    case "孳清噴藥":
    case "貼單作業":
      router.push("/list");
      break;
    case "呼叫順序":
      router.push("/controller");
      break;
  }
  return;
}

function callHelp() {
  $q.notify("已傳送呼叫場控支援");
  let section = store.currentSection.label;
  let payload = {
    ...task.value,
    target:
      (store.target.區別 || "") +
        (store.target.路 || "") +
        (store.target.巷 || "") +
        (store.target.弄 || "") +
        (store.target.號 || "") || store.target.地址,
    組別: store.target.組別,
    time: dayjs().format("HH:mm:ss"),
    received: false,
    status: false,
  };
  addTask(section, payload);
  closeCallDialog();
}
function closeCallDialog() {
  task.value = {
    type: "",
    note: "",
    supply: {
      噴槍油: false,
      噴槍藥: false,
      殺蟲劑: false,
      壓罐: false,
      乳塊: false,
      水: false,
      筆: false,
    },
  };

  callDialog.value = false;
}
</script>
<style scoped lang="scss">
:deep(.q-radio__inner) {
  align-self: flex-start;
}
</style>
