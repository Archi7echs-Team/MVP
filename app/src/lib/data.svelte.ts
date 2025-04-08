// fetch datas from the server
import { type FileValue } from 'svelte-tweakpane-ui';

const fetchDbData = async () => {
	try {
		const response = await fetch('http://localhost:8080/api/coordinates');
		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching DB data:', error);
	}
};

// http://localhost:8080/api/external/data
// fetch external data from the server
const fetchExternalData = async () => {
	try {
		const response = await fetch('http://localhost:8080/api/external/data');
		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching external data:', error);
	}
};

export async function uploadCsvFile(file: any) {
	if (!file) {
		alert('No file provided');
		return;
	}
	const formData = new FormData();
	formData.append('file', file); // Attach the file with the key "file"

	try {
		const response = await fetch('http://localhost:8080/api/uploadCsv', {
			method: 'POST',
			body: formData
		});
		if (!response.ok) {
			const errorMessage = await response.text();
			alert('File invalido:\n' + errorMessage);
			throw new Error(`Error: ${response.statusText}`);
		} else {
			const data = await response.json(); // Parse the JSON response
			return data;
		}
	} catch (error) {
		console.error('Error uploading file:', error);
	}
	return null;
}

let externalData: any = null;
let dbData: any = null;

const init = async () => {
	externalData = await fetchExternalData();
	dbData = await fetchDbData();
};

init();

export const getDbData = () => {
	if (!dbData) {
		throw new Error('Data not initialized');
	}
	return dbData;
};

export const getExternalData = () => {
	if (!externalData) {
		throw new Error('Data not initialized');
	}
	return externalData;
};
