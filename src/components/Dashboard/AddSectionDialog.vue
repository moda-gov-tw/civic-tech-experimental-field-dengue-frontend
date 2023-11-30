<template>
  <q-card style="width: 300px">
    <q-form @submit="submit">
      <q-card-section class="text-h6">新增場次</q-card-section>
      <q-card-section class="q-gutter-sm">
        <q-input
          outlined
          label="場次名稱"
          v-model="section"
          :rules="required"
          hide-bottom-space
        ></q-input>
        <q-input
          outlined
          label="場次日期"
          v-model="date"
          :rules="required"
          hide-bottom-space
        >
          <q-popup-proxy ref="qDateProxy" cover>
            <q-date
              v-model="date"
              mask="YYYY-MM-DD"
              @update:model-value="qDateProxy.hide()"
            >
            </q-date>
          </q-popup-proxy>
        </q-input>
        <q-file outlined v-model="file" label="場次地址檔" hide-bottom-space />
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn flat color="negative" @click="emit('close')">取消</q-btn>
        <q-btn flat color="primary" type="submit">上傳</q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { api } from "boot/axios";
import Store from "stores/default";

const store = Store();
const $q = useQuasar();
const emit = defineEmits(["close"]);

const qDateProxy = ref(null);
const section = ref(null);
const date = ref(null);
const file = ref(null);
const required = [(val) => !!val || ""];

async function submit() {
  const formData = new FormData();
  formData.append("section", section.value);
  formData.append("date", date.value);
  formData.append("file", file.value);
  const res = await store.addSection(formData);
  if (res.status === 200) {
    await store.getSections();
    $q.notify("新增成功");
    emit("close");
  }
}
</script>

<style></style>
