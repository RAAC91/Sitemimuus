## Guia rápido – Use isso se quebrar

Este arquivo documenta as regras atuais do motor de personalização da garrafa.  
Use-o para comparar com o código sempre que algo “sair do lugar” (texto, imagem, cores, captura, etc).

---

### 1. Sistema de coordenadas da garrafa

- **Sistema base em pixels**
  - Altura base fixa: **484px**.
  - Largura base: `BASE_HEIGHT * (ENGINE_CONFIG.hdWidth / ENGINE_CONFIG.hdHeight)`.
  - Esses valores precisam bater com:
    - `ENGINE_CONFIG.hdWidth`
    - `ENGINE_CONFIG.hdHeight`
    - E a máscara do ImageKit (`?tr=h-484`).

- **Escala responsiva (responsiveScale)**
  - Calculada em `BottlePreview` via `ResizeObserver` em `bottleContainerRef`.
  - Fórmula: `responsiveScale = containerHeight / BASE_HEIGHT`.
  - Aplicada **no wrapper inteiro** da garrafa:
    - O mockup **e** o plano 3D (matrix3d) são filhos desse wrapper.
  - Se o texto “sair da garrafa” quando mudar de monitor, verificar:
    - Se `BASE_HEIGHT` continua `484`.
    - Se o cálculo de `responsiveScale` ainda usa a **altura do container**.
    - Se o `transform: scale(${responsiveScale})` ainda está no wrapper da garrafa (e não só em parte do conteúdo).

- **Coordenadas dos layers**
  - Cada layer (`EditorLayer`) usa:
    - `x` e `y` em **porcentagem**, sempre relativos ao plano HD (depois de `matrix3d` + `displayScale`).
  - Posição aplicada assim (texto/imagem):
    - `left: ${layer.x}%`
    - `top: ${layer.y}%`
    - `transform: translate(-50%, -50%) rotate(...)`
  - **Centro da máscara**:
    - `x = 50`, `y = 50` representam o centro geométrico da área útil da garrafa.
    - Se isso mudar, algum cálculo do wrapper/matrix foi alterado.

---

### 2. Máscara, matrix3d e mockup

- **ENGINE_CONFIG (src/components/visual-editor/constants.ts)**
  - `maskUrl`: PNG do ImageKit com `?tr=h-484` (altura fixada em 484px).
  - `hdWidth` / `hdHeight`: resolução “HD” do plano reto da área de impressão.
  - `displayScale`: fator que reduz o plano HD para caber dentro do `width/height` base.
  - `matrix3d`: projeta o plano reto HD dentro da perspectiva da garrafa.

- **Ordem correta dos elementos (dentro do wrapper da garrafa)**
  1. **Wrapper base**
     - `width = BASE_HEIGHT * (hdWidth / hdHeight)`
     - `height = BASE_HEIGHT`
     - `transform: scale(responsiveScale)`
  2. **Mockup da garrafa (`SKUS[sku].mockup`)**
     - `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain`.
  3. **Overlay mascarado**
     - `absolute inset-0`, com:
       - `maskImage` / `WebkitMaskImage = ENGINE_CONFIG.maskUrl`
       - `maskSize = 'contain'`, `maskPosition = 'center'`, `maskRepeat = 'no-repeat'`.
  4. **Plano 3D**
     - `absolute left:0; top:0`.
     - `transform: ENGINE_CONFIG.matrix3d`.
     - `transformOrigin: '0px 0px'`.
     - `width/height` iguais ao wrapper base (mesmos `BASE_HEIGHT` e proporção).
  5. **Plano HD interno**
     - `absolute`, com:
       - `width = ENGINE_CONFIG.hdWidth`
       - `height = ENGINE_CONFIG.hdHeight`
       - `transform: scale(ENGINE_CONFIG.displayScale)`
       - `transformOrigin: 'left top'`
     - **É aqui que os layers são renderizados.**

- Se a máscara não alinhar com a garrafa:
  - Confirmar que mockup e overlay usam **exatamente o mesmo wrapper** (mesmos `width/height` e `scale`).
  - Confirmar que nenhum outro `scale`/`translate` foi colocado só em um dos lados.

---

### 3. Regras de layers (texto / imagem / ícone)

- **EditorLayer (constants.ts)**
  - `type`: `'text' | 'image' | 'icon'`.
  - `x`, `y`: **0–100** (porcentagem do plano HD).
  - `size`: número relativo (base 100) – multiplicado em px dentro do plano HD.

- **Texto**
  - `fontFamily`: vem de `FONTS` (usa variáveis CSS de fonte, ex: `var(--font-montserrat)`).
  - Tamanho efetivo:
    - `fontSize = basePx * (layer.size / 100)`,
    - onde `basePx` varia (`180` ou `280` para algumas fontes).
  - Estilos especiais:
    - Cores metálicas (dourado, prata, etc.) usam `background: linear-gradient(...)` e `WebkitTextFillColor: 'transparent'`.
    - `stroke` usa `WebkitTextStroke` com contraste automático (preto/branco).
    - `glow` adiciona `textShadow`.

- **Imagens / ícones**
  - Renderizados com:
    - Largura base: `360px` (imagem) ou `300px` (ícone).
    - `transform: scale(layer.size / 100)`.
  - Blend para SKU preto:
    - `mixBlendMode = 'screen'` quando `sku === 'Preto'`;
    - Senão, `mixBlendMode = 'multiply'`.

- **Arrastar**
  - Movimentação calcula delta em **px do container de garrafa** e converte para `%`:
    - `percentX = (deltaX / rect.width) * 100`.
    - `percentY = (deltaY / rect.height) * 100`.
  - `x` fica clampado entre 0 e 100; `y` tem limite mínimo 0, sem clamp superior (ajustar aqui se necessário).

---

### 4. Regras de cores e fontes

- **Cores de texto**
  - Lista em `EDITOR_COLORS` (constants.ts).
  - Cada cor tem:
    - `name`
    - `valor` (hex)
    - opcionalmente `style` para gradientes/metálicos.
  - O seletor de cores do texto (`TextControls`) usa **essas** cores; se mudar a paleta, fazer aqui.

- **Cores das garrafas (SKUS)**
  - Cada SKU em `SKUS` possui:
    - `name`
    - `price`
    - `color` (cor base da garrafa)
    - `img` (imagem de produto para loja/carrinho)
    - `mockup` (imagem usada no editor e no preview/captura)
  - Qualquer mudança de mockup precisa manter:
    - Mesmo enquadramento e proporção,
    - Ou então atualizar **matrix3d** e possivelmente `hdWidth`/`hdHeight`.

---

### 5. Regras de captura / checkout

- **Captura com ícones / imagens externas (CORS)**
  - **Problema:** `html-to-image` tenta ler `cssRules` de stylesheets do Google Fonts → `SecurityError`.
  - **Problema 2:** `cacheBust:true` adicionava `?timestamp` em blob URLs → `ERR_FILE_NOT_FOUND`.
  - **Solução definitiva:** pré-converter todas as `<img>` para **data URL (base64)** antes de chamar `toCanvas`:
    ```ts
    // ANTES do toCanvas:
    const imgElements = Array.from(
      captureElement.querySelectorAll("img"),
    ) as HTMLImageElement[];
    await Promise.all(
      imgElements.map(async (img) => {
        const src = img.getAttribute("src") || "";
        if (!src || src.startsWith("data:")) return;
        try {
          const res = await fetch(src, { mode: "cors", cache: "force-cache" });
          if (!res.ok) return;
          const blob = await res.blob();
          const dataUrlInline = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          originalSrcs.set(img, src);
          img.src = dataUrlInline; // html-to-image ignora data: URLs, não re-fetcha
        } catch {
          /* best-effort */
        }
      }),
    );
    ```
  - **Opções obrigatórias do `toCanvas`:**
    ```ts
    toCanvas(el, {
      skipFonts: true, // evita SecurityError das stylesheets cross-origin
      // cacheBust: true  // NÃO usar — corrompía blob/data URLs com ?timestamp
    });
    ```
  - **No `finally`:** restaurar os srcs originais das imagens.
  - **Arquivo:** `src/components/visual-editor/BottleEditor.tsx` → `handleConfirmCapture`.

---

### 7. Passo a passo para restaurar quando quebrar

1. **Texto / imagem não acompanha a garrafa ao mudar de monitor**
   - Garantir:
     - `BASE_HEIGHT = 484`.
     - `maskUrl` ainda tem `?tr=h-484`.
     - `responsiveScale` é aplicado no **wrapper da garrafa inteira**, que contém tanto o mockup quanto o plano 3D.
     - Não há `scale` extra só em um lado (imagem ou plano).

2. **Centro (50%, 50%) não fica no meio da máscara**
   - Verificar:
     - `ENGINE_CONFIG.matrix3d` não foi alterado.
     - `transformOrigin` do plano 3D continua `'0px 0px'`.
     - O wrapper pai não adicionou `translateX`/`translateY` assimétrico.

3. **Mockup e máscara não batem**
   - Conferir:
     - Mockup é `absolute inset-0` com `object-contain`.
     - Overlay mascarado também é `absolute inset-0`.
     - Ambos são filhos do mesmo wrapper com mesma `width/height/scale`.

4. **Cores ou fontes estranhas**
   - Comparar `EDITOR_COLORS` e `FONTS` com este arquivo.
   - Garantir que componentes (`TextControls`, etc.) ainda usam esses arrays.

5. **Captura cortada ou desalinhada**
   - Conferir:
     - Props `zoom` e `yOffset` do `BottlePreview` usado na captura.
     - Chaves de calibração no `localStorage` (`mimuus_capture_*`).

---

### 8. Dica geral

Sempre que algo “esquisito” acontecer:

1. Compare o `BottlePreview.tsx` atual com as regras deste arquivo (especialmente a cadeia: wrapper → mockup → máscara → plano 3D → plano HD → layers).
2. Compare `ENGINE_CONFIG` e `SKUS` com o que está descrito aqui.
3. Se ajustar alguma coisa, atualize este arquivo também, para que ele continue sendo a fonte de verdade de como o motor está configurado.
