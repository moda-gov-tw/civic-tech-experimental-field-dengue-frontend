<template>
  <q-card>
    <q-card-section class="q-gutter-md">
      <q-select
        class="text-h6"
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
      <q-select
        class="text-h6"
        popup-content-class="text-h6"
        size="lg"
        label="組別"
        outlined
        v-model="group"
        :options="[
          '場控',
          '機動',
          '貼單',
          '鎖匠',
          '員警',
          ...(groups ? groups.sort((a, b) => parseInt(a) - parseInt(b)) : []),
          '其他',
        ]"
        clearable
      />
      <q-input v-model="store.name" label="操作人" outlined clearable></q-input>
      <q-icon
        class="cancelBtn"
        size="sm"
        color="grey-5"
        round
        name="cancel"
        @click="clearSign"
      />
      <div :style="{ border: '3px dashed #999', height: '180px' }">
        <VueSignaturePad ref="signaturePad" :options="{ onEnd }" />
      </div>

      <div class="q-mt-xs text-center">請於虛線框內簽名</div>
    </q-card-section>
    <q-card-actions>
      <q-space></q-space>
      <q-btn class="text-h6" flat color="red-5" @click="cancelSign">
        取消
      </q-btn>
      <q-btn
        class="text-h6"
        flat
        color="primary"
        @click="saveSign"
        :disabled="!isSign"
      >
        確認
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { asyncComputed } from "@vueuse/core";
import _ from "lodash";
import Store from "stores/default";
import dayjs from "dayjs";
import { VueSignaturePad } from "vue-signature-pad";
const emit = defineEmits(["close"]);

const store = Store();
const $q = useQuasar();

const signaturePad = ref(null);
const group = ref(null);

store.currentSection = null;

const sections = store.sections
  .filter((o) => !o.hide)
  .map((o) => {
    return {
      label: o.section,
      value: o.section,
    };
  });

const isSign = computed(() => {
  return store.currentSection && store.name && store.sign && group.value;
});

const groups = asyncComputed(async () => {
  if (!store.currentSection) return [];

  let address = await store.getSectionAddress(store.currentSection.label);
  let groups = _.keys(_.groupBy(address, "組別")).filter(
    (v) => !!v && v != "undefined"
  );
  return groups;
});

function clearSign() {
  // store.sign = null;
  // store.signAt = null;
  signaturePad.value.clearSignature();
}

function cancelSign() {
  // store.sign = null;
  // store.signAt = null;
  emit("close");
}

function onEnd(val) {
  const { isEmpty, data } = signaturePad.value.saveSignature();
  if (!isEmpty) {
    store.sign = data;
  }
}
async function saveSign() {
  store.signAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
  await store.signin({
    section: store.currentSection.label,
    group: group.value,
    name: store.name,
    sign: store.sign,
  });
  emit("close");
  $q.notify("簽到完成");
}
</script>

<style scoped>
.cancelBtn {
  cursor: pointer;
  position: absolute;
  right: 0px;
  margin-right: 18px;
  margin-top: 18px;
  padding: 10px;
}
</style>
