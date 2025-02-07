function jsonToYaml(json, indent = 2, level = 0) {
let yamlString = "";
const spacing = " ".repeat(level * indent);
if (typeof json === "string" || typeof json === "number" || typeof json === "boolean" || json === null) {
    yamlString += String(json); 
} else if (Array.isArray(json)) {
    for (const item of json) {
    yamlString += spacing + "- " + jsonToYaml(item, indent, level) + "\n";
    }
} else if (typeof json === "object") {
    for (const key in json) {
    if (json.hasOwnProperty(key)) {
        yamlString += spacing + key + ": " + jsonToYaml(json[key], indent, level + 1) + "\n";
    }
    }
}
return yamlString.trim(); 
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

function yamlToJson(yamlString) {
    try {
      const lines = yamlString.split("\n");
      const result = {};
      let currentObject = result;
      const stack = [];  
      for (const line of lines) {
        const trimmedLine = line.trim();  
        if (!trimmedLine || trimmedLine.startsWith("#")) {
          continue; 
        }  
        const indent = line.length - line.trimStart().length;
        const parts = trimmedLine.split(":");  
        if (parts.length > 1) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(":").trim();   
          if (value) {
            currentObject[key] = value;
          } else {
            const newObject = {};
            currentObject[key] = newObject;
            stack.push(currentObject);
            currentObject = newObject;
          }
        } else if (trimmedLine.startsWith("- ")) {
          const value = trimmedLine.substring(2).trim();
          if (!Array.isArray(currentObject)) {
            const tempObj = currentObject;
            currentObject = [];
            for (const k in tempObj) {
              if (tempObj.hasOwnProperty(k)) {
                currentObject[k] = tempObj[k];
              }
            }
            stack[stack.length - 1][Object.keys(stack[stack.length - 1])[0]] = currentObject;
          }
          currentObject.push(value);
        }
  
        while (stack.length > 0 && indent <= lines[lines.indexOf(line) - 1].length - lines[lines.indexOf(line) - 1].trimStart().length) {
          currentObject = stack.pop();
        }
      }
  
      return result;
    } catch (e) {
      console.error("Error converting YAML to JSON:", e);
      return null;
    }
  }
  

  
