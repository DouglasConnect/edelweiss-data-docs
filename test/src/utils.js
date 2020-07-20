export function succeeded (response) {
    return response.status >= 200 && response.status < 300
}
export async function ensureSuccessful (response) {
    if (!succeeded(response)) {
        let data = await response.text()
        throw `${response.status} ${data}`;
    }
}

export function log(message, type) {
    let logType = type || "success"
    let logTypes = {
        "success": "alert-success",
        "error": "alert-danger"
    }

    let div = document.createElement("div");
    div.setAttribute("class", "alert " + logTypes[logType]);
    div.innerText = message;

    let alerts = document.getElementById("alerts");

    alerts.append(div);
}

export function logError(message) {
    log(message, "error");
}