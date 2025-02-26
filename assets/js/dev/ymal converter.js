function jsonToYaml(json, indent = 2, level = 0) {
    let yamlString = "";
    const spacing = " ".repeat(level * indent);
    if (typeof json === "string" || typeof json === "number" || typeof json === "boolean" || json === null) {
        yamlString += String(json);
    } else if (Array.isArray(json)) {
        for (const item of json) {
            yamlString += spacing+"- \n"+spacing+"- " + jsonToYaml(item, indent, level + 1) + "\n";
        }
    } else if (typeof json === "object") {
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                yamlString += spacing + key + ": " + jsonToYaml(json[key], indent, level + 1) + "\n";
            }
        }
    }
    return yamlString.trim().replaceAll("flows: - ","flows:").replaceAll("containers: - ","containers:");
};

function downloadYaml(yamlString, filename) {
    const blob = new Blob([yamlString], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
