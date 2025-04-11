// fetch datas from the server

export const fetchDbData = async (url: string = 'http://localhost:8080') => {
	const completeURL = url + '/api/coordinates';
	console.log('Fetching db data : ', completeURL);
	const response = await fetch(completeURL);
	if (!response.ok) {
		throw new Error('networkError');
	}
	const data = await response.json();
	return data;
};

// http://localhost:8080/api/external/data
// fetch external data from the server
export const fetchExternalData = async (url: string = 'http://localhost:8080') => {
	const completeURL = url + '/api/external/data';
	console.log('Fetching ext data : ', completeURL);
	const response = await fetch(completeURL);
	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}
	const data = await response.json();
	return data;
};

export async function uploadCsvFile(file: any, url: string = 'http://localhost:8080') {
	if (!file) {
		alert('No file provided');
		return;
	}
	// check if file is a csv file
	if (file.type !== 'text/csv') {
		alert('File is not a csv file');
		return;
	}
	// check if file is less than 10MB
	if (file.size > 10 * 1024 * 1024) {
		alert('File is too large');
		return;
	}
	const formData = new FormData();
	formData.append('file', file); // Attach the file with the key "file"

	const completeURL = url + '/api/uploadCsv';
	console.log('Uploading file to : ', completeURL);

	try {
		const response = await fetch(completeURL, {
			method: 'POST',
			body: formData
		});
		if (!response.ok) {
			const errorMessage = await response.text();
			throw new Error(`${errorMessage}`);
		} else {
			const data = await response.json();
			return data;
		}
	} catch (error: any) {
		if (error.message === 'Failed to fetch') {
			alert('Failed to upload file:\nnet::ERR_CONNECTION_REFUSED');
		} else {
			alert('Error uploading file:\n' + error);
		}
		console.error('Error uploading file: ', error);
	}
	return null;
}

let externalData: any = null;
export let dbData: any = null;

export const init = async (url = 'http://localhost:8080') => {
	try {
		externalData = await fetchExternalData(url);
	} catch (error: any) {
		console.error('Error init fetching external API: ', error);
	}
	try {
		dbData = await fetchDbData(url);
	} catch (error: any) {
		console.error('Error init fetching DB: ', error);
	}
};

//init();

export const getDbData = async () => {
	if (!dbData) {
		try {
			dbData = await fetchDbData();
		} catch (error: any) {
			if (error.message === 'Failed to fetch') {
				alert('Failed to load DB data:\nnet::ERR_CONNECTION_REFUSED');
			} else {
				alert('Error fetching DB data:\n' + error);
			}
			console.error('Error fetching DB data: ', error);
		}
	}
	return dbData;
};

export const getExternalData = async () => {
	if (!externalData) {
		try {
			externalData = await fetchExternalData();
		} catch (error: any) {
			if (error.message === 'Failed to fetch') {
				alert('Failed to load external data:\nnet::ERR_CONNECTION_REFUSED');
			} else {
				alert('Error fetching external data:\n' + error);
			}
			console.error('Error fetching external data: ', error);
		}
	}
	return externalData;
};
