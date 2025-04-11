import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as dataModule from '../lib/data.svelte';
import {
	fetchDbData,
	fetchExternalData,
	uploadCsvFile,
	getDbData,
	dbData
} from '../lib/data.svelte';
import { waitFor } from '@testing-library/svelte';

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
		const data = await dataModule['fetchDbData']('http://app:8080');
		expect(data).toEqual(mockData);
	});
	it('lancia un errore se la risposta non è ok', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			statusText: 'Bad Request'
		});
		await expect(fetchDbData('http://app:8080')).rejects.toThrow('networkError');
	});
});

describe('fetchExternalData', () => {
	it('returns data if fetch succeeds', async () => {
		const mockData = { external: true };
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockData
		});
		const data = await dataModule['fetchExternalData']('http://app:8080');
		expect(data).toEqual(mockData);
	});

	it('lancia un errore se la risposta non è ok', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			text: vi.fn().mockResolvedValue('Error fetching data')
		});
		await expect(fetchExternalData('http://app:8080')).rejects.toThrow('Error fetching data');
	});
});

describe('uploadCsvFile', () => {
	it('alerts if no file is provided', async () => {
		const alertSpy = vi.spyOn(global, 'alert').mockImplementation(() => {});
		await dataModule.uploadCsvFile(null, 'http://app:8080');
		expect(alertSpy).toHaveBeenCalledWith('No file provided');
		alertSpy.mockRestore();
	});
	it('lancia un errore se il file non è un csv', async () => {
		const file = new File(['a,b\n1,2'], 'test.txt', { type: 'text/plain' });
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
		await uploadCsvFile(file, 'http://app:8080');
		expect(alertSpy).toHaveBeenCalledWith('File is not a csv file');
		alertSpy.mockRestore();
	});

	it('lancia un errore se il file è troppo grande', async () => {
		const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
		Object.defineProperty(file, 'size', { value: 20 * 1024 * 1024 });
		await uploadCsvFile(file, 'http://app:8080');
		expect(alertSpy).toHaveBeenCalledWith('File is too large');
		alertSpy.mockRestore();
	});

	it('lancia un errore se la richiesta fetch fallisce', async () => {
		const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			text: vi.fn().mockResolvedValue('Error uploading file')
		});
		await uploadCsvFile(file, 'http://app:8080');
		expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Error uploading file'));
		alertSpy.mockRestore();
	});

	it('restituisce i dati corretti quando il file viene caricato correttamente', async () => {
		const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });
		const mockResponse = { success: true, data: [1, 2] };
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue(mockResponse)
		});
		const result = await uploadCsvFile(file, 'http://app:8080');
		expect(result).toEqual(mockResponse);
	});

	it('lancia un errore se la richiesta fetch fallisce con net::ERR_CONNECTION_REFUSED', async () => {
		const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
		global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
		await uploadCsvFile(file, 'http://app:8080');
		expect(alertSpy).toHaveBeenCalledWith('Failed to upload file:\nnet::ERR_CONNECTION_REFUSED');
		alertSpy.mockRestore();
	});
});

