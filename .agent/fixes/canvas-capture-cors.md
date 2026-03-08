# Fix: Canvas Capture com Ícones Cross-Origin (ERR_FILE_NOT_FOUND / Tainted Canvas)

## Problema

Ao capturar o editor com ícones (`html-to-image` → `toCanvas`), dois erros ocorrem em ciclo:

| Sintoma                                      | Causa                                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `SecurityError: Cannot access rules`         | `html-to-image` tenta ler `cssRules` de stylesheets do Google Fonts (bloqueado por CORS) |
| `ERR_FILE_NOT_FOUND` em `blob:...?timestamp` | `cacheBust: true` adicionava `?timestamp` à blob URL, tornando-a inválida                |
| `Tainted Canvas` / `toDataURL` falha         | Imagens externas (ícones ImageKit) pintadas no canvas sem CORS                           |

## Solução Definitiva (`BottleEditor.tsx` → `handleConfirmCapture`)

### 1. Pré-converter todas as `<img>` para `data:` URL (base64) **antes** do `toCanvas`

```ts
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
      // data: URL → html-to-image ignora completamente (não re-fetcha)
      const dataUrlInline = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      originalSrcs.set(img, src);
      img.src = dataUrlInline;
      await new Promise<void>((resolve) => {
        if (img.complete) {
          resolve();
          return;
        }
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    } catch {
      // best-effort: deixa o src original se fetch falhar
    }
  }),
);
```

### 2. Opções do `toCanvas`

```ts
const canvas = await toCanvas(captureElement, {
  pixelRatio: 2,
  backgroundColor: "#ffffff",
  // cacheBust: true  ← REMOVIDO: corrompía blob/data URLs com ?timestamp
  width: config.width,
  height: config.height,
  skipFonts: true, // ← evita SecurityError ao ler cssRules de stylesheets cross-origin
});
```

### 3. Restaurar srcs originais no `finally`

```ts
} finally {
    originalSrcs.forEach((src, img) => { img.src = src; });
    setIsBusy(false);
}
```

## Por que funciona

- `data:` URLs são **inline** — o `html-to-image` não tenta buscá-las novamente
- Sem `cacheBust`, nenhuma URL é corrompida com `?timestamp`
- O canvas não fica "tainted" pois as imagens foram buscadas via `fetch(mode: 'cors')`
- `skipFonts: true` resolve o `SecurityError` das stylesheets do Google Fonts

## Arquivos afetados

- `src/components/visual-editor/BottleEditor.tsx` → função `handleConfirmCapture`
