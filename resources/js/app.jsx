import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { HeroUIProvider, ToastProvider } from "@heroui/react";

const appName =
    import.meta.env.VITE_APP_NAME || "Datalogic Systems Corporation";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <HeroUIProvider>
                <App {...props} />
                <ToastProvider placement="top-right" />
            </HeroUIProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
