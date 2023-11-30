<template>
  <router-view />
</template>

<script setup>
import Store from "stores/default";
const store = Store();
store.getSections();
store.injectToken();
</script>
<script>
const urlParams = new URLSearchParams(window.location.search);
const openExternalBrowser = urlParams.get("openExternalBrowser");
if (!openExternalBrowser) {
  let url = window.location.href,
    separator = url.indexOf("?") === -1 ? "?" : "&",
    newParam = separator + "openExternalBrowser=1";
  let newUrl = url.replace(newParam, "");
  newUrl += newParam;
  window.location.href = newUrl;
}
</script>

<style>
.underline {
  text-decoration: underline;
}
</style>
