# Gerenciamento de Ativos (Assets) - Mimuus Editor

Este documento explica como gerenciar ícones e fontes no ImageKit para que funcionem corretamente no Editor Mimuus.

## Estrutura de Pastas no ImageKit

O sistema espera que os arquivos estejam organizados na seguinte estrutura dentro do seu Media Library no ImageKit:

```
/mimuus-assets
  /icons
    /coracoes  (Ícones da categoria "Coração")
    /saude     (Ícones da categoria "Saúde")
    /pets      (Ícones da categoria "Pets")
    /vibe      (Ícones da categoria "Vibe")
  /uploads     (Uploads de usuários - Não mexer manualmente)
  /hydra-600ml (Arquivos base da garrafa e máscaras)
```

## Como Adicionar Novos Ícones

1. Acesse o painel do ImageKit.
2. Navegue até a pasta correta (ex: `/mimuus-assets/icons/pets`).
3. Faça upload do arquivo `.svg` (preferencialmente) ou `.png`.
4. Copie a URL do arquivo enviado.
5. Adicione a URL no arquivo `src/components/visual-editor/constants.ts` na categoria apropriada.

Exemplo em `constants.ts`:

```typescript
export const ICON_CATEGORIES: Record<string, string[]> = {
  Pets: [
    "https://ik.imagekit.io/x2or5thkzy/mimuus-assets/icons/pets/novo-icone.svg",
  ],
  // ...
};
```

## Como Adicionar/Corrigir Fontes

O editor suporta as seguintes fontes (definidas em `constants.ts`):

- Marvel
- Poppins
- Black Ops One
- Bangers
- Permanent Marker
- Dancing Script
- Montserrat
- Loverine-otf (Fonte Customizada)

### Fontes do Google (Standard)

A maioria das fontes vem do Google Fonts e já funcionam nativamente no ImageKit sem upload.
Certifique-se apenas de que o nome no `src/lib/hydra-engine.ts` corresponde ao nome correto no Google Fonts.

### Fontes Customizadas (ex: Loverine)

Para usar uma fonte customizada que não está no Google Fonts:

1. Faça o upload do arquivo da fonte (`.ttf` ou `.otf`) para uma pasta no ImageKit (ex: `/fonts`).
2. No `hydra-engine.ts`, o parâmetro `ff` deve apontar para o nome ou caminho da fonte.
   _Nota: O ImageKit tem suporte limitado para fontes customizadas via URL direta. Geralmente requer configuração no painel ou uso de Google Fonts._

## Diagnóstico de Problemas

Se uma imagem ou ícone não aparecer no pdf/imagem final (Hydra URL):

1. Verifique se o arquivo existe no ImageKit.
2. Verifique se a URL gerada no console (Debug View) contém o caminho correto (ex: `i-mimuus-assets:icons:pets:...`).
3. Lembre-se que barras `/` são substituídas por `@@` ou `:` dependendo da configuração. O sistema atual está configurado para usar `@@`.
