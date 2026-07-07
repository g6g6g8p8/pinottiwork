# Integração AirOps

Conectar o site ao AirOps (workflow `69569`) enviando eventos automáticos em background, mais um endpoint de webhook autorizado para o AirOps chamar de volta.

## 1. Secrets no backend

- `AIROPS_API_KEY` — a chave que você já compartilhou (`dq3Q…SWqlGWB`), salva como secret do backend. Nunca vai para o bundle do cliente.
- `AIROPS_WEBHOOK_SECRET` — token aleatório gerado automaticamente. Você copia e cola no AirOps como header `x-airops-secret` (ou similar) para autorizar callbacks.

## 2. Endpoints no site

Todos criados como server routes TanStack Start:

- `POST /api/public/airops-track` — recebe eventos do navegador (fire-and-forget via `sendBeacon`), acrescenta metadados de servidor (IP, país via headers) e faz `POST` para AirOps:
  - URL: `https://app.airops.com/public_api/airops_apps/69569/execute_stream_async` (assíncrono, não bloqueia)
  - Header: `Authorization: Bearer $AIROPS_API_KEY`
  - Body: `{ inputs: { event, path, referrer, userAgent, locale, screen, timestamp, sessionId } }`
  - Responde `204` sempre; erros só vão pro log.
- `POST /api/public/airops-webhook` — endpoint que o AirOps chama de volta com resultados de workflow. Valida `x-airops-secret` (compare timing-safe) antes de processar. Por enquanto só loga o payload; podemos plugar em algo depois (ex.: gravar em tabela, disparar email).

## 3. Eventos disparados pelo site

Um pequeno client tracker (`src/lib/airops.ts` + hook em `__root.tsx`) envia:

- `page_view` — a cada mudança de rota (via `useRouterState`).
- `project_view` — ao abrir `/projects/$slug` (inclui slug).
- `outbound_click` — clique em link externo (LinkedIn, email, etc.).

Todos com `sessionId` gerado em `sessionStorage` para correlacionar. Chamadas usam `navigator.sendBeacon` quando disponível para não bloquear navegação.

## 4. Verificação

- Build local passa sem erro.
- No preview: abrir DevTools → Network → confirmar `POST /api/public/airops-track` em cada navegação, status `204`, e que o header `Authorization` NÃO aparece no request do browser (fica no server).
- Confirmar no dashboard AirOps que o workflow `69569` recebeu execuções.
- Testar webhook com `curl` usando o secret certo e um secret errado — o certo responde `200`, o errado `401`.

## Detalhes técnicos

```
src/
  lib/
    airops.server.ts        # fetch para AirOps + tipos
    airops-track.ts         # client helper (sendBeacon/fetch)
  routes/api/public/
    airops-track.ts         # POST recebe evento e encaminha
    airops-webhook.ts       # POST recebe callback autorizado
  routes/__root.tsx         # useEffect que dispara page_view por rota
```

- `airops.server.ts` lê `process.env.AIROPS_API_KEY` **dentro** do handler (não no top-level) — regra do Workers runtime.
- Webhook usa `timingSafeEqual` sobre o header `x-airops-secret` vs `process.env.AIROPS_WEBHOOK_SECRET`.
- CORS não é necessário: track é chamado same-origin; webhook é server-to-server.
- Nada de PII sensível é enviado — só metadados de navegação já visíveis no GA.

## O que você precisa fazer depois

1. No AirOps, configurar o workflow `69569` para chamar de volta em `https://pinotti.work/api/public/airops-webhook` com o header `x-airops-secret: <valor que vou te mostrar>`.
2. Me dizer se quer eventos adicionais (ex.: envio de formulário de contato, download de CV) além dos três listados.
