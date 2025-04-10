import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as dataModule from '../lib/data.svelte';
import { fetchDbData, fetchExternalData, uploadCsvFile, init, getDbData} from '../lib/data.svelte';

// Mock fetch
const mockFetch = vi.fn();

beforeEach(() => {
	global.fetch = mockFetch;
	mockFetch.mockReset();
});

describe('fetchDbData', () => {
	it('returns data if fetch succeeds', async () => {
		const mockData = { test: 123 };
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockData
		});
		const data = await dataModule['fetchDbData']();
		expect(data).toEqual(mockData);
	});
	it('lancia un errore se la risposta non è ok', async () => {
		// Mock della fetch per restituire una risposta non ok
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			statusText: 'Bad Request'
		});
		await expect(fetchDbData()).rejects.toThrow('networkError');
	});
});

describe('fetchExternalData', () => {
	it('returns data if fetch succeeds', async () => {
		const mockData = { external: true };
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockData
		});
		const data = await dataModule['fetchExternalData']();
		expect(data).toEqual(mockData);
	});

	it('lancia un errore se la risposta non è ok', async () => {
		// Mock della fetch per restituire una risposta non ok
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			text: vi.fn().mockResolvedValue('Error fetching data')
		});

		// Verifica che l'errore venga lanciato con il messaggio corretto
		await expect(fetchExternalData()).rejects.toThrow('Error fetching data');
	});
});

describe('uploadCsvFile', () => {
	it('alerts if no file is provided', async () => {
		const alertSpy = vi.spyOn(global, 'alert').mockImplementation(() => {});
		await dataModule.uploadCsvFile(null);
		expect(alertSpy).toHaveBeenCalledWith('No file provided');
		alertSpy.mockRestore();
	});
	it('lancia un errore se il file non è un csv', async () => {
		const file = new File(['a,b\n1,2'], 'test.txt', { type: 'text/plain' });

		// Spy per verificare se viene mostrato l'alert
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

		await uploadCsvFile(file);

		// Verifica che venga chiamato l'alert per file non csv
		expect(alertSpy).toHaveBeenCalledWith('File is not a csv file');
		alertSpy.mockRestore();
	});

	it('lancia un errore se il file è troppo grande', async () => {
		const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });

		// Spy per verificare se viene mostrato l'alert
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

		// Impostiamo una dimensione troppo grande per il file
		Object.defineProperty(file, 'size', { value: 20 * 1024 * 1024 });

		await uploadCsvFile(file);

		// Verifica che venga chiamato l'alert per file troppo grande
		expect(alertSpy).toHaveBeenCalledWith('File is too large');
		alertSpy.mockRestore();
	});

	it('lancia un errore se la richiesta fetch fallisce', async () => {
		const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });
	
		// Spy per verificare se viene mostrato l'alert
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
	
		// Mock di fetch che fallisce
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			text: vi.fn().mockResolvedValue('Error uploading file')
		});
	
		await uploadCsvFile(file);
	
		// Verifica che venga chiamato l'alert con il messaggio corretto, incluso l'errore
		expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Error uploading file'));
		alertSpy.mockRestore();
	});

	it('restituisce i dati corretti quando il file viene caricato correttamente', async () => {
		const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });

		// Mock di fetch per restituire una risposta corretta
		const mockResponse = { success: true, data: [1, 2] };
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue(mockResponse)
		});

		const result = await uploadCsvFile(file);

		// Verifica che i dati siano stati restituiti correttamente
		expect(result).toEqual(mockResponse);
	});

	it('lancia un errore se la richiesta fetch fallisce con net::ERR_CONNECTION_REFUSED', async () => {
		const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });

		// Spy per verificare se viene mostrato l'alert
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

		// Mock di fetch che fallisce con 'Failed to fetch'
		global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

		await uploadCsvFile(file);

		// Verifica che venga chiamato l'alert con il messaggio corretto
		expect(alertSpy).toHaveBeenCalledWith('Failed to upload file:\nnet::ERR_CONNECTION_REFUSED');
		alertSpy.mockRestore();
	});
});

/*describe('getDbData', () => {
	it('throws error if dbData is null', () => {
	  (dataModule as any).dbData = null;
	  expect(() => dataModule.getDbData()).toThrow('Data not initialized');
	});
  
	it('returns dbData if defined', () => {
	  dataModule.__set__('dbData', { mocked: true });
	  expect(dataModule.getDbData()).toEqual({ mocked: true });
	});
});*/
  
//describe('getExternalData', () => {
	/*it('throws error if externalData is null', () => {
	  (dataModule as any).externalData = null;
	  expect(() => dataModule.getExternalData()).toThrow('Data not initialized');
	});*/
  
	/*it('returns externalData if defined', () => {
	  (dataModule as any).externalData = { external: true };
	  expect(dataModule.getExternalData()).toEqual({ external: true });
	});*/
//});

// Test for init function
describe('init', () => {
	it('logga un errore se la fetch per l\'API esterna fallisce', async () => {
		// Mock della funzione fetch per restituire un errore
		vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed to fetch'));

		// Spy su console.error per verificare se l'errore viene loggato
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		// Chiamata alla funzione init
		await init();

		// Verifica che l'errore venga loggato correttamente
		expect(consoleErrorSpy).toHaveBeenCalledWith('Error init fetching external API: ', expect.any(Error));

		// Ripristina il mock
		consoleErrorSpy.mockRestore();
	});
});

/*describe('getDbData', () => {
	it('chiama fetchDbData e restituisce i dati se dbData è null', async () => {
		const mockData = {x: 1, y: 2};
		vi.spyOn(dataModule, 'fetchDbData').mockResolvedValue(mockData);

		// Imposta dbData a null
		let dbData = null;

		const result = await getDbData();

		// Verifica che fetchDbData sia stato chiamato e che i dati restituiti siano corretti
		expect(dataModule.fetchDbData).toHaveBeenCalled();
		expect(result).toEqual(mockData);
	});
	
	it('non chiama fetchDbData se dbData non è null e restituisce dbData', async () => {
		const mockData = {};

		// Imposta dbData con dei dati
		let dbData = mockData;

		const result = await getDbData();

		// Verifica che fetchDbData non sia stato chiamato
		expect(dataModule.fetchDbData).not.toHaveBeenCalled();
		expect(result).toEqual(mockData);
	});
});*/