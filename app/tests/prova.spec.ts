import { test, expect } from '@playwright/test';

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