import * as Tests from "./tests.js"
import * as Utils from "./utils.js"

async function runTests(){
    let token = await Utils.getToken()
    let dataset = await Tests.createDataset(token)
    console.log("CreateDataset", dataset)
    let uploadResult = await Tests.uploadData(token, dataset.id)
    console.log("UploadData",uploadResult)
    let inferResult = await Tests.inferSchema(token, dataset.id)
    console.log("InferSchema",inferResult);
    let uploadMetdataResult = await Tests.uploadMetadata(token, dataset.id)
    console.log("UploadMetadata", uploadMetdataResult)
    let publishResult = await Tests.publishDataset(token, dataset.id)
    console.log("PublishDataset",publishResult)
    let queryResult = await Tests.queryDataset(token, dataset.id)
    console.log("QueryDataset",queryResult)
    let deleteResult = await Tests.deleteDataset(token, dataset.id)
    console.log("DeleteDataset", deleteResult)
}

function clearResults(){
    document.getElementById("alerts").innerHTML = "";
}
document.getElementById("btnRun").addEventListener("click", runTests);
document.getElementById("btnClear").addEventListener("click", clearResults);
