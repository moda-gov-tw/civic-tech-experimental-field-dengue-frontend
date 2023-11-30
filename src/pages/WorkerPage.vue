<template>
  <PreCheck v-if="store.worker == '貼單作業'"></PreCheck>
  <Spray v-if="store.worker == '孳清噴藥'"></Spray>
  <Help class="q-pa-lg" v-if="store.worker == '呼叫順序'"></Help>
</template>

<script setup>
import PreCheck from "components/Worker/PreCheck.vue";
import Spray from "components/Worker/Spray.vue";
import Help from "components/Worker/Help.vue";
import Store from "stores/default";
import { useQuasar } from "quasar";
import { defaultReport } from "src/configs";
import _ from "lodash";
import { useRouter } from "vue-router";
const $q = useQuasar();
const store = Store();
const router = useRouter();

if (!store.target || !store.target.地址) {
  router.push("/");
}
store.target.report = _.cloneDeep(store.target.report || defaultReport);
</script>

<style></style>
