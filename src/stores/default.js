import { defineStore } from "pinia";
import _ from "lodash";
import { addressKey } from "src/configs";
import { api } from "boot/axios";

export default defineStore("default", {
  state: () => ({
    token: null,
    PIN: "",
    isSys: false,
    target: {},
    name: "",
    sign: null,
    signAt: null,
    worker: "",
    sprayHelper: "",
    address: [],
    sections: [],
    currentSection: null,
    currentSource: {
      source: {},
      index: null,
    },
    addressFilter: {
      路: null,
      巷: null,
      弄: null,
      組別: null,
      關鍵字: null,
    },
    helpFilter: {
      組別: null,
    },
    supportFilter: {
      role: null,
      組別: null,
    },
  }),
  getters: {
    workerKey() {
      if (this.worker === "貼單作業") {
        return "preCheck";
      } else if (this.worker === "孳清噴藥") {
        return "spray";
      }
    },
    signExpired() {
      return (
        !this.signAt || new Date() - new Date(this.signAt) > 1000 * 60 * 60 * 24
      );
    },
  },
  actions: {
    injectToken() {
      api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    },
    async signin(payload) {
      let { data } = await api.post(`/sign`, payload);
      this.token = data.token;
      this.injectToken();
    },
    async login(payload) {
      try {
        let { data } = await api.post("/dashboard/login", payload);
        this.token = data.token;
        this.injectToken();
        return true;
      } catch (error) {
        return false;
      }
    },
    async getACL() {
      try {
        let { data } = await api.get("/dashboard/me");
        if (!data.account) {
          throw new Error("無法取得使用者資料");
        }
        return data.acl;
      } catch (error) {
        return false;
      }
    },

    async getSigns(section) {
      let { data } = await api.get(`/sign/${section}`);
      return data;
    },
    async getSingleAddress(_id) {
      let { data } = await api.get(`/address/${_id}`);
      return data;
    },
    async getSectionAddress(section) {
      let { data } = await api.get(`/section/${section}/address`);
      return data;
    },
    async getSections() {
      let sections = await api.get("/section");
      this.sections = sections.data;
    },
    async addSection(formData) {
      const res = await api.post("/section", formData);
      return res;
    },
    getAddress(address) {
      return (
        (address.路 || "") +
          (address.巷 || "") +
          (address.弄 || "") +
          (address.號 || "") || address.地址
      );
    },
    async deleteAddress(_id) {
      await api.delete(`/address/${_id}`);
    },
    async updateAddress(section, address) {
      await api.post(`/address`, {
        section,
        address,
      });
    },
    async searchAddress(section, keyword, condition) {
      let { data } = await api.post("/address/search", {
        section,
        keyword,
        condition,
      });
      return data;
    },
    async updateSection(row) {
      await api.post(`/section/${row._id}`, row);
      await this.getSections();
    },
    async deleteSection(key) {
      await api.delete(`/section/${key}`);
      await this.getSections();
    },
    async resetSection(key) {
      await api.delete(`/section/${key}/reset`);
      await this.getSections();
    },
    async saveReport(extraType) {
      let key = null;
      switch (extraType || this.worker) {
        case "貼單作業":
          key = "preCheck";
          this.target.report[key].reporter = this.name;
          break;
        case "孳清噴藥":
          key = "spray";
          this.sprayHelper = this.target.report[key].噴藥人員;
          this.target.report[key].reporter = this.name;
          break;
        default:
          key = extraType;
          break;
      }

      if (key) {
        let originAddress = _.findLast(
          this.address,
          _.pick(this.target, addressKey)
        );
        if (!originAddress.report) {
          originAddress.report = this.target.report;
          await api.post(`/report/${originAddress._id}`, {
            report: this.target.report,
          });
        } else {
          originAddress.report[key] = this.target.report[key];
          await api.post(`/report/${originAddress._id}/${key}`, {
            report: this.target.report[key],
          });
        }
      }
    },
  },
  persist: true,
});
