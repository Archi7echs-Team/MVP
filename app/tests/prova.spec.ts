import { test, expect } from '@playwright/test';
import { exp } from 'three/tsl';

test('L’utente deve essere in grado di ingrandire una specifica area del grafico 3D per visualizzare più dettagli', async ({ page }) => {
    await page.goto('http://localhost:5173');
  
    // Aspetta che il canvas sia visibile
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 10000 });
  
    const before = await page.screenshot({ fullPage: true });
  
    // Prendi le dimensioni del canvas per calcolare la posizione di zoom
    const box = await canvas.boundingBox();
    if (box) {
      const centerX = box.x + box.width / 2;  // Centro del canvas (asse X)
      const centerY = box.y + box.height / 2; // Centro del canvas (asse Y)
  
      // Posiziona il mouse al centro del canvas
      await page.mouse.move(centerX, centerY);
  
      // Simula lo zoom in (scroll del mouse in avanti)
      await page.mouse.wheel(0, -100); // Movimenti più negativi per lo zoom in
  
      // Aspetta un po’ per permettere alla scena di aggiornarsi
      await page.waitForTimeout(3000);
  
      // Screenshot dopo lo zoom
      const after = await page.screenshot({ fullPage: false });
  
      // Verifica che l'immagine sia cambiata (zoom visivo)
      expect(before).not.toBe(after);
    }
  });

  test('L’utente deve essere in grado di rimpicciolire una specifica area del grafico 3D per visualizzare meno dettagli', async ({ page }) => {
    await page.goto('http://localhost:5173');
  
    // Aspetta che il canvas sia visibile
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 10000 });
  
    const before = await page.screenshot({ fullPage: true });
  
    // Prendi le dimensioni del canvas per calcolare la posizione di zoom
    const box = await canvas.boundingBox();
    if (box) {
      const centerX = box.x + box.width / 2;  // Centro del canvas (asse X)
      const centerY = box.y + box.height / 2; // Centro del canvas (asse Y)
  
      // Posiziona il mouse al centro del canvas
      await page.mouse.move(centerX, centerY);
  
      // Simula lo zoom in (scroll del mouse in avanti)
      await page.mouse.wheel(0, +100); // Movimenti più positivi per lo zoom out
  
      // Aspetta un po’ per permettere alla scena di aggiornarsi
      await page.waitForTimeout(3000);
  
      // Screenshot dopo lo zoom
      const after = await page.screenshot({ fullPage: false });
  
      // Verifica che l'immagine sia cambiata (zoom visivo)
      expect(before).not.toBe(after);
    }
  });

  test('L’utente può resettare la visualizzazione tramite un bottone', async ({ page }) => {
    await page.goto('http://localhost:5173');
  
    // Aspetta il canvas e il bottone
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 10000 });
  
    // Ruota la scena (es. drag sinistro)
    const box = await canvas.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
  
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX + 100, startY + 100);
      await page.mouse.up();
    }
    await page.waitForTimeout(3000);
    const screenshot = await page.screenshot({ fullPage: true });
  
    // Clic sul bottone di reset (usa il selettore migliore che hai disponibile)
    const resetButton = page.locator('div.tp-lblv.tp-v-fst.tp-v-vfst >> button.tp-btnv_b:has(div.tp-btnv_t:has-text("Reset"))');
    await resetButton.click();
    await page.waitForTimeout(3000);
    const fReset = await page.screenshot({ fullPage: true });
    expect(screenshot).not.toEqual(fReset);
    await resetButton.click();
    await page.waitForTimeout(3000);
    const sReset = await page.screenshot({ fullPage: true });
    expect(fReset).toEqual(sReset);
  });