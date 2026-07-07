import { createFileRoute } from "@tanstack/react-router";

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export const Route = createFileRoute("/api/public/airops-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.AIROPS_WEBHOOK_SECRET;
        if (!expected) {
          console.error("[airops-webhook] AIROPS_WEBHOOK_SECRET missing");
          return new Response("Server not configured", { status: 503 });
        }

        const provided =
          request.headers.get("x-airops-secret") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
          "";

        if (!provided || !timingSafeEqualStr(provided, expected)) {
          return new Response("Unauthorized", { status: 401 });
        }

        let payload: unknown = null;
        try {
          payload = await request.json();
        } catch {
          payload = await request.text().catch(() => null);
        }

        console.log(
          "[airops-webhook] received",
          JSON.stringify(payload).slice(0, 2000),
        );

        return Response.json({ ok: true });
      },
    },
  },
});
