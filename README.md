# data-bureau.github.io

Site institucional estático para o Data Bureau — focado em revisão e preparação de figuras científicas para publicação.

## Estrutura

- `index.html` — landing page (PT/EN, client-side)
- `about.html` — sobre a equipe e metodologia
- `cases/` — páginas de cases (antes/depois) e os markdowns explicativos
- `docs/guidelines/` — checklists e guias em Markdown (Nature, Elsevier, cores, tipografia)
- `docs/viewer.html` — visualizador de Markdown client-side
- `assets/css/styles.css` — estilos modernos, botões coloridos, design melhorado
- `assets/js/main.js` — i18n JSON-based, carrossel de depoimentos, smooth scroll
- `assets/` — figuras, placeholders e imagens OG
- `i18n/` — traduções JSON (pt.json, en.json)

## Publicação no GitHub Pages

1. Confirme que este repositório está no GitHub e que a branch `main` contém os arquivos acima.
2. Em Settings → Pages, defina a fonte para a branch `main` e a pasta `/` (root). O site será servido em `https://<usuário>.github.io/<repositório>/` ou por domínio customizado se configurado.
3. Este projeto inclui `.nojekyll` para evitar que o GitHub Pages processe o site com Jekyll — o servidor servirá os arquivos estáticos (HTML, JS, CSS, MD) diretamente.

Notas
- Os arquivos em `docs/guidelines/` são Markdown de referência e podem ser linkados diretamente; se quiser renderizá-los como páginas HTML no site, posso adicionar um simples renderer client-side (JS) que converte Markdown para HTML no cliente.
- Para adicionar autenticação, formulários ou processamento server-side, será necessário integrar um backend ou usar serviços de terceiros (Formspree, Netlify Forms etc.).

