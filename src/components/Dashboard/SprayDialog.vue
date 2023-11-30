<template>
  <q-card style="width: 400px">
    <q-card-section style="max-height: 80vh" class="scroll">
      <Spray></Spray>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn color="primary" @click="emit('close')">取消</q-btn>
      <q-btn color="primary" @click="save">儲存</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import _ from "lodash";
import Store from "stores/default";
import { onMounted, ref, computed } from "vue";
import Spray from "src/components/Worker/Spray.vue";
import { api } from "boot/axios";

const store = Store();
const report = ref({});
const emit = defineEmits(["close"]);

async function save() {
  await store.saveReport("孳清噴藥");
  emit("save");
}
</script>

<style></style>
