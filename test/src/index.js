import * as Tests from "./tests.js"

async function runTests(){
    let dataset = await Tests.createDataset()
    console.log("CreateDataset", dataset)
    let uploadResult = await Tests.uploadData(dataset.id)
    console.log("UploadData",uploadResult)
    let inferResult = await Tests.inferSchema(dataset.id)
    console.log("InferSchema",inferResult);
    let publishResult = await Tests.publishDataset(dataset.id)
    console.log("PublishDataset",publishResult)
    let queryResult = await Tests.queryDataset(dataset.id)
    console.log("QueryDataset",queryResult)
    let deleteResult = await Tests.deleteDataset(dataset.id)
    console.log("DeleteDataset", deleteResult)
}

function clearResults(){
    document.getElementById("alerts").innerHTML = "";
}
document.getElementById("btnRun").addEventListener("click", runTests);
document.getElementById("btnClear").addEventListener("click", clearResults);
