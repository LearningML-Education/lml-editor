import { Router } from "@vaadin/router";

function initRouter() {
    const router = new Router(document.getElementById("app")); 
    router.setRoutes([
        {
            path: "/",
            component: "lml-home",
            action: () => import("./lml-home")
        },
        {
            path: "/model-text",
            component: "lml-model-text",
            action: () => import("./lml-model-text"),
        },
    ]);
} 

window.addEventListener("load", () => initRouter());