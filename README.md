# Schiavoni Advogados — landing page

Site estático (HTML + CSS + JS puro, sem build). Para ver localmente: `python3 -m http.server 8000` e abrir `http://localhost:8000`.

## Estrutura
- `index.html` — página única (cabeçalho, hero, escritório, áreas, atendimento, conteúdos, contato, rodapé)
- `privacidade.html` — política de privacidade (**rascunho**, trechos pendentes destacados)
- `assets/css/styles.css` — estilos; **todas as cores em variáveis `:root`**
- `assets/js/config.js` — telefone, WhatsApp, e-mail, Instagram e endpoint do formulário
- `assets/js/main.js` — menu móvel, artigos, validação e envio do formulário
- `data/articles.json` — conteúdos jurídicos (edite a lista; o layout não muda)
- `assets/fonts` — Cormorant Garamond e Open Sans, auto-hospedadas (OFL), sem chamadas ao Google

## Pendências (dependem do escritório)
1. **Formulário**: defina `formEndpoint` em `assets/js/config.js` (Formspree, Web3Forms ou backend próprio). Enquanto vazio, o formulário valida os campos, mas **não envia nada e informa isso ao visitante** (com e-mail/WhatsApp como alternativa). Depois, atualize a seção 4 da política de privacidade com o operador escolhido.
2. **Política de privacidade**: preencher razão social/CNPJ, encarregado (se houver), prazo de guarda, registros do provedor de hospedagem e validar bases legais.
3. **Artigos**: os 9 títulos/resumos/capas foram transcritos de capturas da listagem do site atual. Preencher `url` (e `date`, se desejado) de cada item em `data/articles.json`; sem `url`, o link aponta para `https://schiavoniadvogados.com.br/blog/` (endereço presumido, conferir).
4. **Imagens**: logotipo e imagens foram recortados de capturas de tela (baixa resolução). Substituir por arquivos originais. Não há foto no hero; as imagens de Civil e Trabalhista usam martelo (do site atual), sugere-se trocar por fotos sóbrias licenciadas.
5. **Cores**: amostradas das capturas — vermelho `#EE3239`, grafite `#272B2E`, `#262627`, fundo `#F1F1F1`. Confirmar os HEX oficiais. Foram adicionados dois derivados (`--brand-red-strong`, `--brand-red-on-dark`) apenas para atingir contraste AA em texto pequeno.
6. **Domínio/OG**: `canonical`, `og:url` e `og:image` assumem `https://schiavoniadvogados.com.br/`. Horário de atendimento e Facebook/LinkedIn não foram publicados nas capturas e foram omitidos.
7. Validar os textos das áreas com o escritório e a conformidade com o Provimento 205/2021.
