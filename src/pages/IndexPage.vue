<template>
  <q-page class="flex flex-center column q-gutter-md">
    <!-- <div class="camara-container" v-show="scanner">
      <QrcodeStream :paused="pause" :track="track"></QrcodeStream>
    </div>

    <template v-if="!pause">
      <q-btn
        size="lg"
        color="negative"
        icon="stop"
        label="停止掃描"
        @click="stopScan"
      />
    </template>
    <template v-else>
      <q-btn
        size="lg"
        color="primary"
        icon="qr_code"
        label="掃描地址"
        @click="startScan"
      />
    </template> -->
    <q-btn
      class="q-mb-xl"
      size="lg"
      color="brown-5"
      icon="edit"
      label="場次簽到"
      @click="openDialogSign"
    />
    <q-btn
      size="lg"
      color="green-7"
      icon="cleaning_services"
      label="孳清噴藥"
      @click="goList('孳清噴藥')"
    />
    <q-btn
      v-if="store.isSys"
      size="lg"
      color="cyan-7"
      icon="assignment"
      label="貼單作業"
      @click="goList('貼單作業')"
    />
    <q-btn
      v-if="store.isSys"
      size="lg"
      color="orange-7"
      icon="tune"
      label="機動場控"
      @click="router.push('/controller')"
    />
  </q-page>

  <q-dialog v-model="dialogSign" persistent full-width>
    <Sign @close="dialogSign = false"></Sign>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import Store from "stores/default";
import Sign from "components/Common/SignDialog.vue";

const store = Store();
const router = useRouter();
const $q = useQuasar();
const dialogSign = ref(false);

store.isSys = router.currentRoute.value.name == "sys";

function openDialogSign() {
  store.sign = null;
  dialogSign.value = true;
}

function goList(worker) {
  store.worker = worker;
  router.push("/list");
}
</script>

<style lang="scss" scoped></style>
