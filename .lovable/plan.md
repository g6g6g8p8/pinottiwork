## Objetivo
Adicionar o case **Mitsubishi – Cada Km Mit Conta** (parceria com SAS Brasil no Rally dos Sertões) ao portfólio e colocá-lo num duo final com `give-yourself-this-chance`.

## 1. Novo arquivo de projeto
Criar `public/content/projects/mit-cada-km-mit-conta.md`:

- `title`: "Mitsubishi: Cada Km Mit Conta"
- `slug`: `mit-cada-km-mit-conta`
- `client`: Mitsubishi Motors
- `role`: **Art Director**
- `category`: **Social Impact**
- `tags`: Brand Purpose, TV & Film, Social Impact, Early Career
- `order`: 6
- `aspect_ratio`: `16:9`
- `hero`: placeholder temporário (você envia o still oficial depois — deixo um asset neutro ou reuso um frame editorial simples até a troca)
- `description`: "No Rally dos Sertões, cada quilômetro rodado com a Mitsubishi virou doação para o SAS Brasil levar saúde a regiões onde só um 4x4 chega."

Corpo (mesma linguagem dos outros cases) com:
- **The Challenge** — o SAS Brasil precisava chegar a regiões remotas que só veículos 4x4 alcançam.
- **Insight** — transformar a aventura a bordo das Mitsubishis em doação real para o SAS.
- Filme manifesto: `[video](https://vimeo.com/625822810)`
- **The Campaign** — para cada km rodado com a hashtag `#CadaKmMitConta` e foto do painel, R$1 doado ao SAS Brasil durante o Rally dos Sertões.
- Filme de resultado: `[video](https://vimeo.com/625841483)`
- **Credits** — CD Fabiano Feijó · AD Giulio Pinotti · CW José Scorzelli, Eduardo Cometti · Content William Santos · Prod. Eduardo "Duba" Guimarães.

## 2. Hero / capa
Como você vai enviar o still depois, vou usar um placeholder neutro temporário (gero um still minimalista 16:9 com paleta Mitsubishi/Sertões — vermelho Mitsu, areia, tipografia discreta "Cada Km Mit Conta"). Quando me mandar o frame oficial, troco o asset mantendo o mesmo path.

## 3. Encaixe na home
Layout atual termina com:
```
duo | amazon-conta-com-a-gente | give-yourself-this-chance
```
Proposta — promover Amazon a hero solo e fechar com o novo duo:
```
hero | amazon-conta-com-a-gente
duo  | mit-cada-km-mit-conta | give-yourself-this-chance
```
Isso evita repetir `give-yourself-this-chance` e dá destaque solo ao Amazon, mantendo dois cases Mitsubishi pareados no fim (Cada Km + Give Yourself).

Alternativa B se preferir manter Amazon em duo: substituir o duo final por
```
duo | amazon-conta-com-a-gente | mit-cada-km-mit-conta
hero | give-yourself-this-chance
```

## Detalhes técnicos
- Arquivo novo: `public/content/projects/mit-cada-km-mit-conta.md`.
- Asset hero novo: `src/assets/mit-cada-km-mit-conta.jpg` (placeholder via `imagegen` + upload `lovable-assets`).
- Edit em `public/data/home-layout.md` (duas últimas linhas).
- Vimeo embeds usam a mesma sintaxe `[video](https://vimeo.com/<id>)` já adotada no case Amazon — sem mudanças no parser.
- Nenhuma alteração de rota, schema ou componente.
