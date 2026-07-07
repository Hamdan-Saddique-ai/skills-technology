import { createRootRoute, Outlet, HeadContent, Scripts } from "@tanstack/react-router";
import { WeatherBackground } from "@/components/WeatherBackground";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import appCss from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Skills Technology Solutions" },
      {
        name: "description",
        content:
          "Practical, creator-focused courses in 3D animation and TikTok automation.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <WeatherBackground />
        <Nav />
        <main className="mx-auto min-h-[60vh] max-w-6xl px-4 pb-24 pt-10">
          <Outlet />
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}
