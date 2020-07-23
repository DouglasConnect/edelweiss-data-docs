import {log, logError, ensureSuccessful} from './utils.js'

async function getToken(){
    let response = await fetch("/token.jwt")
    await ensureSuccessful(response)
    return response.text()
}

export async function createDataset(){
    try {
        let token = await getToken()
        const data = { name: 'my-dataset' };
        let fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify(data),
        };

        let response = await fetch("https://api.edelweissdata.com/datasets/create", fetchOptions);
        await ensureSuccessful(response);

        let dataset = await response.json();
        log(`CreateDataset: Dataset ${dataset.name} was created Successful`);
        return dataset;
    }
    catch(error){
        logError("CreateDataset: " + error);
        throw new Error("Create and Publish Failed");
    }
}

let lines = [
    '"FirstName","LastName"\n',
    '"John","Doe"\n',
    '"Jane","Doe"\n'
]
let file = new File(lines, "test.csv")

export async function uploadData(datasetId){
    try
    {
        let token = await getToken()
        let baseUrl = "https://api.edelweissdata.com/datasets";

        let formData = new FormData();
        formData.append("data", file)

        let fetchOptions = {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${token}`,  //Replace then XXX with your API token
            },
            body: formData,
        }

        let response = await fetch(`${baseUrl}/${datasetId}/in-progress/data/upload`, fetchOptions)
        await ensureSuccessful(response)
        let result = await response.json()
        log("UploadData: Data was uploaded Succesfully");
        return result;
    }
    catch(error)
    {
        logError('UploadData: ' + error);
    }
}

export async function inferSchema(datasetId){
    try
    {
        let token = await getToken()
        let baseUrl = "https://api.edelweissdata.com/datasets";

        let fetchOptions = {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${token}`,  //Replace then XXX with your API token
            }
        }

        let response = await fetch(`${baseUrl}/${datasetId}/in-progress/schema/infer`, fetchOptions)
        await ensureSuccessful(response)
        let result = await response.json()
        log("InferSchema: Schema was inferred Succesfully");
        return result;
    }
    catch(error)
    {
        logError(`InferSchema: ${error}`);
    }
}

export async function publishDataset(datasetId){
    try
    {
        let token = await getToken()
        let baseUrl = "https://api.edelweissdata.com/datasets";

        const data = { changelog: 'Initial Version' };
        let fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`,  //Replace then XXX with your API token
            },
            body: JSON.stringify(data)
        }

        let response = await fetch(`${baseUrl}/${datasetId}/in-progress/publish`, fetchOptions)
        await ensureSuccessful(response)
        let result = await response.json()
        log("PublishDataset: Data was published Succesfully");
        return result;
    }
    catch(error)
    {
        logError(`PublishDataset: ${error}`);
    }
}

export async function queryDataset(datasetId){
    try
    {
        let token = await getToken()
        let baseUrl = "https://api.edelweissdata.com/datasets";
        let version = 1;

        let query = {
            columns:[]
        };
        let queryString = JSON.stringify(query);
        let fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`,  //Replace then XXX with your API token
            },
        }

        let response = await fetch(`${baseUrl}/${datasetId}/versions/${version}/data?query=${queryString}`, fetchOptions)
        await ensureSuccessful(response)
        let result = await response.json()
        log("QueryDataset: Dataset Query was successful");
        return result;
    }
    catch(error)
    {
        logError(`QueryDataset: ${error}`);
    }
}

export async function deleteDataset(datasetId){
    try
    {
        let token = await getToken()
        let baseUrl = "https://api.edelweissdata.com/datasets";

        const data = { changelog: 'Initial Version' };
        let fetchOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`,  //Replace then XXX with your API token
            },
            body: JSON.stringify(data)
        }

        let response = await fetch(`${baseUrl}/${datasetId}`, fetchOptions)
        await ensureSuccessful(response)
        log("DeleteDataset: Data was published Succesfully");
    }
    catch(error)
    {
        logError(`DeleteDataset: ${error}`);
    }
}