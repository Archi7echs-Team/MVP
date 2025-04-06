import { test, expect } from '@playwright/test';

test('L’utente può visualizzare il grafico 3D interattivo con barre', async ({ page }) => {
  // Vai all'app
  await page.goto('http://localhost:5173'); // o l'URL della tua app

  // Verifica che il canvas sia presente
  const canvas = await page.locator('canvas');
  await expect(canvas).toBeVisible();

  // Aspetta un attimo che le barre si carichino (opzionale, a seconda del rendering)
  await page.waitForTimeout(1000);

  // Controlla che almeno una barra sia presente nel DOM (es. mesh o elemento SVG/DOM)
  // Questo dipende da come le tue barre sono strutturate. Se sono mesh, puoi cercare nel WebGL via test heuristici.
  const content = await page.content();
  expect(content).toContain('canvas'); // oppure una classe identificativa, se ne hai una

  // (Opzionale) Simula un'interazione se supportata (es. click su canvas)
  await canvas.click({ position: { x: 100, y: 100 } });

  // Aspettati che qualcosa cambi se clicchi (es. appaiono dati, evidenziazione, ecc.)
});
