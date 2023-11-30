const routes = [
  {
    path: "/dashboard",
    component: () => import("layouts/EmptyLayout.vue"),
    children: [
      {
        name: "login",
        path: "",
        component: () => import("pages/Dashboard/LoginPage.vue"),
      },
    ],
  },
  {
    path: "/dashboard",
    component: () => import("layouts/DashboardLayout.vue"),
    children: [
      {
        name: "search",
        path: "search",
        component: () => import("pages/Dashboard/SearchPage.vue"),
      },
      {
        name: "section",
        path: "section",
        component: () => import("pages/Dashboard/SectionPage.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/EmptyLayout.vue"),
    children: [
      {
        name: "basic",
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        name: "sys",
        path: "sys",
        component: () => import("pages/IndexPage.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/TitleLayout.vue"),
    children: [
      {
        path: "List",
        component: () => import("pages/ListPage.vue"),
      },
      {
        meta: { title: "機動場控" },
        path: "controller",
        component: () => import("pages/ControllerPage.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/WorkerLayout.vue"),
    children: [
      {
        path: "worker",
        component: () => import("pages/WorkerPage.vue"),
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
