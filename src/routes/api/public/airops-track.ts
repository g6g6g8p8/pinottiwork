import { createFileRoute } from "@tanstack/react-router";

const AIROPS_URL =
  "https://app.airops.com/public_api/airops_apps/69569/execute_stream_async";

export const Route = createFileRoute("/api/public/airops-track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const apiKey = process.env.AIROPS_API_KEY;
          if (!apiKey) {
            console.error("[airops-track] AIROPS_API_KEY missing");
            return new Response(null, { status: 204 });
          }

          const body = (await request.json().catch(() => null)) as Record<
            string,
            unknown
          > | null;
          if (!body || typeof body !== "object") {
            return new Response(null, { status: 204 });
          }

          const inputs = {
            ...body,
            ip:
              request.headers.get("cf-connecting-ip") ??
              request.headers.get("x-forwarded-for") ??
              null,
            country: request.headers.get("cf-ipcountry") ?? null,
            receivedAt: new Date().toISOString(),
          };

          // Fire-and-forget upstream call; never block the caller.
          void fetch(AIROPS_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ inputs }),
          })
            .then(async (res) => {
              if (!res.ok) {
                const text = await res.text().catch(() => "");
                console.error(
                  "[airops-track] upstream error",
                  res.status,
                  text.slice(0, 500),
                );
              }
            })
            .catch((err) => {
              console.error("[airops-track] fetch failed", err);
            });

          return new Response(null, { status: 204 });
        } catch (err) {
          console.error("[airops-track] handler error", err);
          return new Response(null, { status: 204 });
        }
      },
    },
  },
});
