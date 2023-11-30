<template>
  <div class="col-12 flex flex-center text-h6 q-py-sm row">
    <div class="flex flex-center column">
      <div>
        {{ store.target.場次 }}
        <span v-if="store.target.組別" class="text-subtitle1">
          ({{ store.target.組別 }}組)</span
        >
      </div>

      <div class="flex full-width justify-center">
        <div class="q-mx-sm">
          <span>作業: </span>
          <span class="cursor-pointer editable" @click="editWorker">{{
            store.worker || "[請填寫]"
          }}</span>
        </div>
        <div class="q-mx-md">
          <span>操作人: </span>
          <span>{{ store.name }}</span>
        </div>
      </div>
      <div
        class="cursor-pointer editable"
        @click="open(store.getAddress(store.target))"
      >
        <q-icon size="sm" name="location_on" />
        {{ store.getAddress(store.target) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import Store from "stores/default";
import { useQuasar } from "quasar";
import { computed } from "vue";
import { useRouter } from "vue-router";

const $q = useQuasar();
const store = Store();
const router = useRouter();

if (!store.name || store.signExpired) {
  $q.notify({ color: "red-5", message: "請先執行場次簽到", timeout: 3000 });
  router.replace(`/${store.isSys ? "sys" : ""}`);
}

function editWorker() {
  $q.dialog({
    class: "text-h6",
    title: "請選擇作業",
    options: {
      size: "lg",
      model: store.worker,
      type: "radio",
      items: [
        { label: "貼單作業", value: "貼單作業" },
        { label: "孳清噴藥", value: "孳清噴藥" },
        { label: "呼叫順序", value: "呼叫順序" },
      ],
    },
    cancel: false,
    persistent: true,
  }).onOk((data) => {
    store.worker = data;
  });
}
// function editName() {
//   $q.dialog({
//     title: "請輸入操作者姓名",
//     prompt: {
//       model: store.name,
//       type: "text",
//       class: "text-h6",
//     },
//     cancel: false,
//     persistent: true,
//   }).onOk((data) => {
//     store.name = data;
//   });
// }

function open(target) {
  window.open(`https://www.google.com/maps/search/台南市${target}`, "_blank");
}
</script>

<style lang="scss" scoped>
.editable {
  // text-decoration: underline;
  border-bottom: 1px dashed #fff;
  padding-bottom: 0px;
}
</style>
