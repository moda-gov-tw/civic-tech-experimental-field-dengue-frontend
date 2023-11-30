<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-md shadow-2 my_card" bordered>
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">
          登革熱防疫數位工具後台
        </div>
      </q-card-section>
      <q-card-section>
        <q-input outlined v-model="user.account" label="請輸入帳號"></q-input>
        <q-input
          outlined
          class="q-mt-md"
          v-model="user.password"
          type="password"
          label="請輸入密碼"
        ></q-input>
      </q-card-section>
      <q-card-section>
        <q-btn
          color="primary"
          size="lg"
          label="登入"
          class="full-width"
          @click="login"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import Store from "stores/default";
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { set } from "firebase/database";

const store = Store();
const $q = useQuasar();
const router = useRouter();
const user = ref({
  account: null,
  password: null,
});
const account = ref(null);
const password = ref(null);

async function login() {
  if (!user.value.account || !user.value.password) {
    $q.notify({
      color: "negative",
      message: "請輸入帳號密碼",
      icon: "report_problem",
    });
    return;
  }

  $q.loading.show();
  if (await store.login(user.value)) {
    $q.loading.hide();
    $q.notify("登入成功");
    router.push("/dashboard/search");
  } else {
    $q.loading.hide();
    $q.notify({
      color: "negative",
      message: "登入失敗",
      icon: "report_problem",
    });
  }
}
</script>

<style scoped>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
