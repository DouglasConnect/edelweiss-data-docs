export async function ensureSuccessful (response) {
    if (!response.ok) {
        const data = await response.text()
        throw `${response.status} ${data}`;
    }
}

export async function getConfig() {
    let response = await fetch("/config.json")
    await ensureSuccessful(response)
    return response.json()
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
