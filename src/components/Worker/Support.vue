<template>
  <div class="flex column q-gutter-xs q-pa-md">
    <div>
      <q-btn
        size="lg"
        color="primary"
        class="full-width q-mb-md"
        @click="addSupporter"
      >
        新增支援人員
      </q-btn>
    </div>
    <div class="row q-mb-sm q-col-gutter-sm">
      <div class="col-6">
        <q-select
          class="text-h6"
          popup-content-class="text-h6"
          v-model="store.supportFilter.role"
          label="角色"
          :options="roleOptions"
          outlined
          clearable
        ></q-select>
      </div>
      <div class="col-6">
        <div class="col-6">
          <q-input
            class="text-h6"
            v-model="store.supportFilter.組別"
            label="組別"
            outlined
            clearable
          ></q-input>
        </div>
      </div>
    </div>
    <template v-if="ready && Object.keys(supportFilter).length">
      <div class="q-col-gutter-sm">
        <div class="row" v-for="row of supportFilter">
          <div
            class="col-5 text-h6 flex items-center"
            @click="updateSupporter(row)"
          >
            {{ row.role || "-" }}
            <span v-if="row.組別" class="text-subtitle1 q-pl-sm">
              ({{ row.組別 }}組)</span
            >
          </div>
          <div
            class="col-5 text-h6 flex items-center"
            @click="updateSupporter(row)"
          >
            <template v-if="row.phone">
              <a :href="`tel:${row.phone}`">{{ row.name }}</a>
            </template>
            <template v-else>
              {{ row.name }}
            </template>
          </div>
          <div class="col-2 text-h6 flex">
            <q-btn
              round
              dense
              flat
              icon="delete"
              size="md"
              @click="removeSupport(currentSection.value, row.id)"
            />
          </div>
        </div>
      </div>
    </template>
    <div
      v-if="ready && !Object.keys(supportFilter).length"
      class="text-h6 text-center"
    >
      目前尚無任何支援人員
    </div>
  </div>
  <q-dialog v-model="supportDialog">
    <SupportDialog
      :selectedSupporter="selectedSupporter"
      @close="supportDialog = false"
    ></SupportDialog>
  </q-dialog>
</template>

<script setup>
import Store from "stores/default";
import { watchSupport, removeSupport } from "src/libs/firebase";
import { ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import _ from "lodash";
import SupportDialog from "components/Worker/SupportDialog.vue";

const router = useRouter();
const store = Store();
const support = ref(null);
const supportDialog = ref(false);
const ready = ref(false);
const selectedSupporter = ref(null);
const currentSection = storeToRefs(store).currentSection;
let stopWatch = ref(() => {});

const roleOptions = computed(() => {
  return _.uniq(_.map(support.value, "role"));
});

const supportFilter = computed(() => {
  let list = _.map(support.value, (o, id) => ({
    ...o,
    id,
  }));
  if (store.supportFilter.role) {
    list = _.filter(list, (o) => o.role == store.supportFilter.role);
  }
  if (store.supportFilter.組別) {
    list = _.filter(list, (o) => o.組別.includes(store.supportFilter.組別));
  }
  return list;
});

handleWatchSupport(store.currentSection);
watch(currentSection, (val) => {
  handleWatchSupport(val);
});

function handleWatchSupport(section) {
  stopWatch.value();
  if (section && section.label) {
    stopWatch.value = watchSupport(section.label, (data) => {
      support.value = data || null;
      ready.value = true;
    });
  }
}

function addSupporter() {
  selectedSupporter.value = null;
  supportDialog.value = true;
}

function updateSupporter(row) {
  selectedSupporter.value = row;
  supportDialog.value = true;
}
</script>

<style lang="scss" scoped>
.text-h6 {
  // font-size: 18px !important;
  line-height: 24px !important;
}
.text-subtitle1 {
  // font-size: 16px !important;
  line-height: 24px !important;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
