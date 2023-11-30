<template>
  <q-card style="width: 300px">
    <q-card-section class="text-h6"
      >{{ supporter.id ? "更新" : "新增" }}支援人員</q-card-section
    >
    <q-card-section class="q-gutter-md">
      <q-select
        class="text-h6"
        popup-content-class="text-h6"
        label="角色"
        outlined
        :model-value="supporter.role"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="types"
        @input-value="setMRole"
        hint="若無合適選項可自行輸入"
      >
      </q-select>
      <q-input
        class="text-h6"
        label="組別"
        v-model="supporter.組別"
        outlined
      ></q-input>
      <q-input
        class="text-h6"
        label="姓名"
        v-model="supporter.name"
        outlined
      ></q-input>
      <q-input
        class="text-h6"
        label="電話"
        v-model="supporter.phone"
        outlined
      ></q-input>
    </q-card-section>
    <q-card-actions>
      <q-space></q-space>
      <q-btn class="text-h6" flat color="negative" @click="emit('close')">
        取消
      </q-btn>
      <q-btn class="text-h6" flat color="primary" @click="handleAddSupport">
        {{ supporter.id ? "更新" : "新增" }}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import Store from "stores/default";
import _ from "lodash";
import { useQuasar } from "quasar";
import { ref } from "vue";
import { updateSupport, addSupport } from "src/libs/firebase";

const store = Store();
const { selectedSupporter } = defineProps(["selectedSupporter"]);
const $q = useQuasar();
const emit = defineEmits(["close"]);

const supporter = ref(
  selectedSupporter || {
    role: "",
    name: "",
    phone: "",
    組別: "",
  }
);
let types = ["鎖匠", "員警", "場控", "機動"].map((o) => ({
  label: o,
  value: o,
}));

function handleAddSupport() {
  if (!supporter.value.id) {
    addSupport(store.currentSection.value, supporter.value);
  } else {
    let payload = _.cloneDeep(supporter.value);
    delete payload.id;
    updateSupport(store.currentSection.value, supporter.value.id, payload);
  }
  emit("close");
  // supporter.value = {
  //   role: "",
  //   name: "",
  //   phone: "",
  //   組別: "",
  // };
}

function setMRole(val) {
  supporter.value.role = val;
}
</script>

<style></style>
