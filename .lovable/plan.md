## Objetivo

Adicionar o case **Amazon.com.br – Conta com a gente** (campanha de lançamento da Amazon no Brasil, 2019) ao portfólio como novo projeto e exibi-lo em duo no final da home, pareado com outro Advertising existente.

## 1. Novo arquivo de projeto

Criar `public/content/projects/amazon-conta-com-a-gente.md` com a estrutura usada pelos demais cases:

- `title`: "Amazon.com.br: Conta com a gente"
- `slug`: `amazon-conta-com-a-gente`
- `client`: Amazon.com.br
- `role`: **Art Director** (conforme escolhido)
- `category`: **Advertising**
- `tags`: Launch Campaign, TV & Film, Brand Storytelling, Early Career
- `order`: 5 (depois dos atuais)
- `hero`: still gerado (ver passo 2)
- `aspect_ratio`: `16:9` (formato dos filmes)
- `description`: linha curta — "Campanha oficial de lançamento da Amazon no Brasil, com a mensagem de que os brasileiros podiam contar com a marca."

Conteúdo do corpo (markdown), na mesma linguagem dos outros cases:

```text
## The Challenge
A chegada oficial da Amazon ao Brasil exigia uma mensagem inequívoca: a
marca estava aqui para ficar e para servir o público brasileiro com a mesma
confiabilidade de sempre.

## Insight
"Conta com a gente" — uma promessa simples, direta e calorosa, traduzida
em histórias do cotidiano de diferentes brasileiros que poderiam, a partir
de agora, contar com a Amazon.

[video](https://vimeo.com/315103707)

## The Campaign
Filme-manifesto de 45s + quatro filmes complementares de 15s, cada um
mostrando um perfil de cliente: Vovô, Mãe, Gamer e Menina.

:::gallery
[video](https://vimeo.com/315120054)
[video](https://vimeo.com/315120096)
[video](https://vimeo.com/315120078)
[video](https://vimeo.com/315120116)
:::

## Credits
Creative Director: Alexandre Prado · Art Directors: Giulio Pinotti, Diego Silva
· Copywriter: Paulo Fontana · Production: Consulado · Audio: HitMaker
```

> Observação: usarei a sintaxe `[video](url)` / `:::gallery` exatamente como os
> outros cases já fazem. Se o renderer atual de ProjectDetail ainda não suportar
> embed direto do Vimeo, ajusto o componente para reconhecer URLs `vimeo.com` e
> renderizar via `<iframe player.vimeo.com/video/ID>`. Verifico isso na hora de
> implementar e, se necessário, faço a pequena extensão no parser de vídeo.

## 2. Hero / capa do card

Gerar uma imagem **still** representando a campanha (composição minimalista,
paleta Amazon — preto, branco e laranja Amazon `#FF9900`, com tipografia
discreta "Conta com a gente"), salvar em `src/assets/amazon-conta-com-a-gente.jpg`
em 16:9, fazer upload via `lovable-assets` e referenciar a URL `/__l5e/...` no
campo `hero` do markdown.

Não consigo extrair frame real do Vimeo automaticamente; se você preferir mandar
um still oficial depois, é só substituir o arquivo.

## 3. Encaixe na home

Hoje o final de `public/data/home-layout.md` é:

```text
duo | the-reconquest | give-yourself-this-chance
hero | mastercard-priceless-ecosystem
duo | connecting-clients | alternative-investments
```

Proposta (mantém Advertising com Advertising e cria o duo novo no final):

```text
hero  | the-reconquest
hero  | mastercard-priceless-ecosystem
duo   | connecting-clients | alternative-investments
duo   | amazon-conta-com-a-gente | give-yourself-this-chance
```

- `give-yourself-this-chance` (Mitsubishi, Advertising) vira par natural do
  Amazon — ambos são filmes de marca de early/ad-craft career.
- `the-reconquest` ganha destaque solo como hero (estava dividindo espaço).
- Amazon entra como o último bloco da home, fechando a narrativa com a
  campanha de lançamento mais reconhecível do portfólio.

Se preferir não promover o Reconquest a hero, alternativa B é manter o duo
atual e só acrescentar `duo | amazon-conta-com-a-gente | give-yourself-this-chance`
na última linha — mas aí `give-yourself` aparece duas vezes na home, o que
prefiro evitar.

## Detalhes técnicos

- Único arquivo de conteúdo novo: `public/content/projects/amazon-conta-com-a-gente.md`.
- Único arquivo editado: `public/data/home-layout.md` (4 linhas finais).
- Asset novo: `public/.../amazon-conta-com-a-gente.jpg` via `lovable-assets`.
- Se o renderer atual não suportar embed de Vimeo, pequena extensão em
  `ProjectDetail`/parser de vídeo para aceitar URLs `vimeo.com/<id>` →
  `https://player.vimeo.com/video/<id>`.
- Sem mudanças em rotas, schema, ou outros componentes.
