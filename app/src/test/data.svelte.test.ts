import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as dataModule from '../lib/data.svelte';

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

	it('throws error if fetch fails', async () => {
		mockFetch.mockResolvedValueOnce({ ok: false });
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		await dataModule['fetchDbData']();
		expect(spy).toHaveBeenCalled();
		spy.mockRestore();
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

	it('throws error if fetch fails', async () => {
		mockFetch.mockResolvedValueOnce({ ok: false });
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		await dataModule['fetchExternalData']();
		expect(spy).toHaveBeenCalled();
		spy.mockRestore();
	});
});

describe('uploadCsvFile', () => {
	it('alerts if no file is provided', async () => {
		const alertSpy = vi.spyOn(global, 'alert').mockImplementation(() => {});
		await dataModule.uploadCsvFile(null);
		expect(alertSpy).toHaveBeenCalledWith('No file provided');
		alertSpy.mockRestore();
	});

	it('returns data if upload succeeds', async () => {
		const responseData = { status: 'ok' };
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => responseData
		});
		const result = await dataModule.uploadCsvFile(new File([], 'test.csv'));
		expect(result).toEqual(responseData);
	});
});

describe('getDbData', () => {
	it('throws error if dbData is null', () => {
	  (dataModule as any).dbData = null;
	  expect(() => dataModule.getDbData()).toThrow('Data not initialized');
	});
  
	/*it('returns dbData if defined', () => {
	  dataModule.__set__('dbData', { mocked: true });
	  expect(dataModule.getDbData()).toEqual({ mocked: true });
	});*/
});
  
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