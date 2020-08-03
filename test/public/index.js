import * as Tests from "./tests.js"
import * as Utils from "./utils.js"

async function runTests(){
    let config = await Utils.getConfig()
    let dataset = await Tests.createDataset(config)
    console.log("CreateDataset", dataset)
    let uploadResult = await Tests.uploadData(config, dataset.id)
    console.log("UploadData",uploadResult)
    let inferResult = await Tests.inferSchema(config, dataset.id)
    console.log("InferSchema",inferResult);
    let uploadMetdataResult = await Tests.uploadMetadata(config, dataset.id)
    console.log("UploadMetadata", uploadMetdataResult)
    let publishResult = await Tests.publishDataset(config, dataset.id)
    console.log("PublishDataset",publishResult)
    let queryResult = await Tests.queryDataset(config, dataset.id)
    console.log("QueryDataset",queryResult)
    let deleteResult = await Tests.deleteDataset(config, dataset.id)
    console.log("DeleteDataset", deleteResult)
}

function clearResults(){
    document.getElementById("alerts").innerHTML = "";
}
document.getElementById("btnRun").addEventListener("click", runTests);
document.getElementById("btnClear").addEventListener("click", clearResults);
