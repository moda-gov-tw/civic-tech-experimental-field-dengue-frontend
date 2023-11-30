<template>
  <q-layout view="lhh Lpr lfr">
    <q-drawer
      ref="elDrawer"
      v-model="drawer"
      side="left"
      overlay
      elevated
      class="drawer text-white"
    >
      <div class="text-center text-h6 q-my-lg">登革熱孳清化噴數位工具</div>
      <template v-for="item of menu">
        <q-list
          v-if="item.enable"
          @click="active = item.key"
          class="q-mx-sm q-mb-xs"
        >
          <q-item
            clickable
            v-ripple
            :active="active == item.key"
            active-class="bg-active text-white rounded-borders"
            :to="item.to ? item.to : null"
          >
            <q-item-section class="text-subtitle1">
              {{ item.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </template>
      <q-list class="q-mx-sm q-mb-xs" @click="logout">
        <q-item clickable v-ripple>
          <q-item-section class="text-subtitle1"> 登出 </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import Store from "stores/default";
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { onClickOutside } from "@vueuse/core";

const store = Store();
const $q = useQuasar();
const router = useRouter();
const drawer = ref(false);
const elDrawer = ref(null);
const active = ref(router.currentRoute.value.name || "dashboard");
const menu = ref([]);

(async () => {
  let acl = await store.getACL();
  if (!acl) {
    $q.notify({
      color: "negative",
      message: "請重新登入",
      icon: "report_problem",
    });
    router.push("/dashboard");
  }
  menu.value = [
    {
      key: "search",
      name: "綜合搜尋",
      to: "/dashboard/search",
      enable: acl.search,
    },
    {
      key: "section",
      name: "場次管理",
      to: "/dashboard/section",
      enable: acl.section,
    },
  ];
})();

function logout() {
  store.token = null;
  router.push("/dashboard");
}

onClickOutside(elDrawer, (event) => {
  drawer.value = false;
});
</script>
<style lang="scss" scoped>
:deep(.drawer) {
  background-color: rgb(15, 76, 129);
  .bg-active {
    background-color: #ffffff47;
  }
}
</style>
