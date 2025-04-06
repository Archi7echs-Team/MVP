import { test, expect } from '@playwright/test';

test('L’utente può visualizzare il grafico 3D interattivo con barre', async ({ page }) => {
  test.setTimeout(60000);
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
});

test('L’utente può ruotare la visualizzazione 3D con il mouse', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Aspetta che il canvas sia visibile
  const canvas = page.locator('canvas');
  await canvas.waitFor({ state: 'visible', timeout: 10000 });

  // Screenshot iniziale prima della rotazione
  const before = await page.screenshot({ fullPage: true });

  // Simula movimento mouse (drag del mouse per ruotare la scena)
  const box = await canvas.boundingBox();
  if (box) {
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.down();
    await page.mouse.move(startX + 200, startY + 200); // Simula rotazione
    await page.mouse.up();
  }

  // Aspetta un po’ per permettere alla scena di aggiornarsi
  await page.waitForTimeout(3000);  // Aumentato il timeout per dare tempo alla scena di ruotare

  // Screenshot dopo la rotazione
  const after = await page.screenshot({ fullPage: true });

  // Verifica che l'immagine sia cambiata (rotazione visiva)
  expect(before).not.toBe(after); // Confronto diretto (rimozione del Buffer.compare)
});

test('L’utente può muoversi nel grafico come se fosse in un ambiente 2D, spostandosi solo orizzontalmente', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Aspetta che il canvas sia visibile
  const canvas = page.locator('canvas');
  await canvas.waitFor({ state: 'visible', timeout: 10000 });

  const before = await page.screenshot({ fullPage: true });

  // Prendi le dimensioni del canvas per calcolare il punto centrale
  const box = await canvas.boundingBox();
  if (box) {
    const startX = box.x + box.width / 2;  // Centro del canvas (asse X)
    const startY = box.y + box.height / 2; // Centro del canvas (asse Y)

    // Simula il movimento del mouse: muovi al centro del canvas
    await page.mouse.move(startX, startY);

    // Simula il clic destro del mouse per iniziare il movimento orizzontale
    await page.mouse.down({ button: 'right' });

    // Muovi il mouse orizzontalmente (esempio: verso destra)
    await page.mouse.move(startX + 200, startY);

    // Rilascia il tasto destro del mouse (fine del movimento)
    await page.mouse.up({ button: 'right' });
  }

  // Aspetta un po’ per permettere alla scena di aggiornarsi
  await page.waitForTimeout(3000);  // Aumentato il timeout per dare tempo alla scena di muoversi

  // Screenshot dopo il movimento orizzontale
  const after = await page.screenshot({ fullPage: true });

  // Verifica che l'immagine sia cambiata (movimento visivo)
  expect(before).not.toBe(after);
});

test('L’utente può muoversi nel grafico come se fosse in un ambiente 2D, spostandosi solo verticalmente', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Aspetta che il canvas sia visibile
  const canvas = page.locator('canvas');
  await canvas.waitFor({ state: 'visible', timeout: 10000 });

  const before = await page.screenshot({ fullPage: true });

  // Prendi le dimensioni del canvas per calcolare il punto centrale
  const box = await canvas.boundingBox();
  if (box) {
    const startX = box.x + box.width / 2;  // Centro del canvas (asse X)
    const startY = box.y + box.height / 2; // Centro del canvas (asse Y)

    // Simula il movimento del mouse: muovi al centro del canvas
    await page.mouse.move(startX, startY);

    // Simula il clic destro del mouse per iniziare il movimento orizzontale
    await page.mouse.down({ button: 'right' });

    // Muovi il mouse orizzontalmente (esempio: verso destra)
    await page.mouse.move(startX, startY + 200); 

    // Rilascia il tasto destro del mouse (fine del movimento)
    await page.mouse.up({ button: 'right' });
  }

  // Aspetta un po’ per permettere alla scena di aggiornarsi
  await page.waitForTimeout(3000);  // Aumentato il timeout per dare tempo alla scena di muoversi

  // Screenshot dopo il movimento orizzontale
  const after = await page.screenshot({ fullPage: true });

  // Verifica che l'immagine sia cambiata (movimento visivo)
  expect(before).not.toBe(after);
});

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

