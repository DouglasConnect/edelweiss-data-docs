import {log, logError, ensureSuccessful} from './utils.js'

let token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik0wTTVORFl5UXprd01qQXlSVFF3T0RORFFrVXlNVGswTWpCRVJUZEZOelUzUTBFd01UWXdPUSJ9.eyJodHRwczovL2NsYWltcy5lZGVsd2Vpc3MuZG91Z2xhc2Nvbm5lY3QuY29tL2VtYWlsIjoib2R5QGRvdWdsYXNjb25uZWN0LmNvbSIsImlzcyI6Imh0dHBzOi8vZWRlbHdlaXNzLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwODU2NjI0OTUxMDUwNTQ1MDc0OCIsImF1ZCI6Imh0dHBzOi8vYXBpLmVkZWx3ZWlzc2RhdGEuY29tIiwiaWF0IjoxNTk1MjA5NTI4LCJleHAiOjE1OTUyOTU5MjgsImF6cCI6IjVPN0lkeE9ab3lFeVc1M1NDVjhLSDVxcjcwWDlCaWdJIiwic2NvcGUiOiJvZmZsaW5lX2FjY2VzcyJ9.aBsZA2IubuVdbrH4nxgl4KalBNtzc1QgRzBUkynVfCRepGOTv5fPvG0vt5sGkOitFgGKgWOIWOPfpt5JgCt1SNJco4UKk9UlnpjEKZjzSP_1mDi2T3r8MNTQS-RxIhR--28k7p7gNDiG3qb-887nGeWs8x8nGDM3wEnLIk5CnkkEdkTlxg5-pMxcrmlMjfDz5r2Qio3ni2I87l0RR5Rc4yIfRaXvmd0byVfb5lTP9Qqf1ATt85ypW2wIkkZntXNI_HiGQ-JpKShGU4PD_QttCepRHFjme69iVOBByg_gDL-4X0YkmgXqtMrmVEjCjrebNMzSMbo-RlTwUNeL7n9INw"

export async function createDataset(){
    try {
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
        log(`CreateDataset: Dataset ${dataset.name} Creation was Successful`);
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
        log("InferSchema: Data was uploaded Succesfully");
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