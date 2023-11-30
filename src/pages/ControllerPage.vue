<template>
  <q-page class="flex column q-gutter-md q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col-12 q-pl-none">
        <q-select
          class="text-h6 full-width"
          popup-content-class="text-h6"
          size="lg"
          label="場次"
          outlined
          v-model="store.currentSection"
          :options="sections"
          clearable
        >
          <template v-slot:selected-item="scope">
            <div class="ellipsis" style="width: calc(100vw - 115px)">
              {{ scope.opt.label }}
            </div>
          </template>
        </q-select>

        <q-tabs v-model="tab" class="tabs-bottom">
          <q-tab name="status" label="場次進度" icon="view_list" />
          <q-tab name="support" label="支援名單" icon="group" />
          <q-tab name="help" label="呼叫支援" icon="campaign" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="q-pa-none">
          <q-tab-panel name="status" class="q-pa-none">
            <div>
              <Status v-if="store.currentSection"></Status>
            </div>
          </q-tab-panel>
          <q-tab-panel name="support" class="q-pa-none">
            <div>
              <Support v-if="store.currentSection"></Support>
            </div>
          </q-tab-panel>
          <q-tab-panel name="help" class="q-pa-none">
            <div>
              <Help v-if="store.currentSection"></Help>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { api } from "boot/axios";
import _ from "lodash";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

import Help from "components/Worker/Help.vue";
import Status from "components/Worker/Status.vue";
import Support from "components/Worker/Support.vue";
import Store from "stores/default";
import { ref, computed } from "vue";

const store = Store();
const $q = useQuasar();
const router = useRouter();

const tab = ref("status");

const sections = store.sections
  .filter((o) => !o.hide)
  .map((o) => {
    return {
      label: o.section,
      value: o.section,
    };
  });

if (!store.name || store.signExpired) {
  $q.notify({ color: "red-5", message: "請先執行場次簽到", timeout: 3000 });
  router.replace(`/${store.isSys ? "sys" : ""}`);
}
</script>

<style lang="scss" scoped>
.tabs-bottom {
  border-bottom: 1px solid #d8d8d8;
}
:deep(.td-size) {
  text-align: center !important;
  font-size: 16px !important;
  padding: 0px !important;
  th {
    text-align: center !important;
    font-size: 16px !important;
    padding: 0px !important;
  }
}
:deep(.q-tab__label) {
  font-size: 16px;
  margin-top: 4px;
}
:deep(.q-tab) {
  margin-top: 10px;
  padding: 6px;
  i {
    font-size: 34px;
  }
}
</style>
