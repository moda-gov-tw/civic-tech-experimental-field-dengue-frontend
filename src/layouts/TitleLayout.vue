<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <div class="col-12 flex text-h6 q-py-sm row">
          <div class="col-auto flex-center column">
            <q-icon name="arrow_back_ios" size="md" @click="back" />
          </div>
          <div class="col flex flex-center column">
            <div class="flex full-width justify-center">
              <div class="q-mx-md text-white q-pr-md">
                {{ route.meta.title || store.worker + "列表" }}
              </div>
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import Store from "stores/default";
import { useRoute, useRouter } from "vue-router";
const store = Store();
const route = useRoute();
const router = useRouter();

function back() {
  router.push(`/${store.isSys ? "sys" : ""}`);
}
</script>
