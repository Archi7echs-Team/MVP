// fetch datas from the server


const fetchDbData = async () => {
    const response = await fetch('http://localhost:8080/api/coordinates');
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
}

// http://localhost:8080/api/external/data
// fetch external data from the server
const fetchExternalData = async () => {
    const response = await fetch('http://localhost:8080/api/external/data');
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
}

let externalData:any = null;
let dbData:any = null;

const init = async () => {
    externalData = await fetchExternalData();
    dbData =  await fetchDbData();
}

init()

export const getDbData = () => {
    if (!dbData) {
        throw new Error('Data not initialized');
    }
    return dbData;
}

export const getExternalData = () => {
    if (!externalData) {
        throw new Error('Data not initialized');
    }
    return externalData;
}