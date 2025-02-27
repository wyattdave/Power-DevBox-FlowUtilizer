///By David Wyatt
let sDefinition = "";
let sDefinitionParsed = "";
let oReport;
let oLiveReport;
let sCustomList = null;
let oHTML;
let aConnectionTier=aConnectionTierBackup.value;;
let i = 0;
let iDefinitionFind = 0;
let iDefinitionCount = 0;
let oSaved;
let oSavedDef;
let oRatings;
let oNaming;
let aComplexity;
let aScoring;
let oConfigReference;
let oSolution;
let aEnvironmentVar=[];
let sEnvironment="";
let oDependencies;
let bUpdate=false;
let aExceptions=[];
let aConnectors=[];
let bFirstFlow=false;

const iResetStorage = 8;
const regExpFileID = new RegExp("[A-Z0-9]{8}-([A-Z0-9]{4}-){3}[A-Z0-9]{12}","m");


/////////////////////////////
const fileInput = document.getElementById("file-input");
const encodingInput = "utf-8";
const fileInputButton = document.getElementById("uploadZip");
const passwordInput = "";
let entries;
let selectedFile;
fileInput.onchange = selectFile;
fileInputButton.onclick = () =>
  fileInput.dispatchEvent(new MouseEvent("click"));

async function selectFile() {
  try {
    fileInputButton.disabled = true;
    unpackNestedZipFiles(fileInput.files[0]);
  } catch (error) {
    console.log(error);
  } finally {
    fileInputButton.disabled = false;
    fileInput.value = "";
  }
}

async function unpackNestedZipFiles(file) {
  //try {
    aExceptions=[];
    aEnvironmentVar=[];
    aConnectors=[];
    bFirstFlow=true
    if (file.name.endsWith(".zip") || file.name.endsWith(".msapp")) {
      const zipReader = new zip.ZipReader(new zip.BlobReader(file));
      const entries = await zipReader.getEntries();
      let entryIndex = 0;
      if (entries && entries.length) {
        sCustomList = null;
        oSolution = null;
        iDefinitionFind = 0;
        iDefinitionCount = 0;
        const filenamesUTF8 = Boolean(
          !entries.find((entry) => !entry.filenameUTF8)
        );
        for (const entry of entries) {
          const fileData = await entry.getData(new zip.TextWriter());
          if (
            (entry.filename.includes("definition.json") && !entry.filename.includes("Connector/")) ||
            (entry.filename.includes("Workflows/") &&
              !entry.filename.includes("apisMap") &&
              !entry.filename.includes("connectionsMap"))
          ) {
            entryIndex++;
            review(entry, "flow", fileData,true);
            iDefinitionCount++;
          } else if (entry.filename.includes("customizations.xml")) {
            review(entry, "customizations", fileData),false;
          }
        }
      }
      if (iDefinitionCount == 0 ) {
        alert("No Flows Found in Zip");
      }
      if(bUpdate){
        UpdateConfigs();
      }

      await zipReader.close();
      console.log(aExceptions)
    } else {
      alert("No a Zip file");
      console.log(file.name);
    }
 /// } catch (error) {
 ///   console.log(error.message);
  ///  alert( "Unexpected Error: " + error.message);
 /// }
}

////processes files from zip
async function review(entry, type, sDefinition,bExcept) {
  try {

    if (type == "flow") {
      sDefinitionParsed = JSON.parse(sDefinition);
      oReport = null;
      let sId = "";
      if (entry.filename.match(regExpFileID)) {
        sId = entry.filename.match(regExpFileID)[0];
      }

      oReport = CreateReview(
        sDefinition,
        "unknown",
        sId,
        aComplexityTemplate,
        oNamingTemplate,
        aConnectionTier,
        ""
      );

      if (oReport.error == "") {
        if (oReport.name == "unknown" && sCustomList != null) {
          let sFlowName;
          try {
            sFlowName = sCustomList.ImportExportXml.Workflows.Workflow.find(
              (item) =>
                item.WorkflowId.toUpperCase() ==
                "{" + oReport.id + "}".toUpperCase()
            );
          } catch (error) {
            sFlowName = sCustomList.ImportExportXml.Workflows.Workflow;
          }
          if (sFlowName != null && sFlowName != undefined) {
            oReport.name = sFlowName.Name;
          }
        }
        if(bExcept){
          aExceptions.push(oReport);
        }
      }
    } else if (type == "customizations") {
        sCustomList = xmlToJson.parse(sDefinition);
  
        let sConnectionRefs = "";
        let sTables = "";
        let sSecurityProfile = "";
        let sCanvasApps = "";
        let sCustomControls = "";
        let sRoles = "";
        let sLanguageCode = "";
  
        if (
          sCustomList?.ImportExportXml?.connectionreferences
            ?.connectionreference != undefined
        ) {
          sConnectionRefs =
            sCustomList.ImportExportXml.connectionreferences.connectionreference;
        } else {
          sConnectionRefs = [];
        }
        if (sCustomList?.ImportExportXml?.Entities?.Entity != undefined) {
          sTables = sCustomList.ImportExportXml.Entities.Entity;
        } else {
          sTables = [];
        }
        if (
          sCustomList?.ImportExportXml?.FieldSecurityProfiles
            ?.FieldSecurityProfile != undefined
        ) {
          sSecurityProfile =
            sCustomList.ImportExportXml.FieldSecurityProfile
              .FieldSecurityProfiles;
        } else {
          sSecurityProfile = [];
        }
        if (sCustomList?.ImportExportXml?.CanvasApps?.CanvasApp != undefined) {
          sCanvasApps = sCustomList.ImportExportXml.CanvasApps.CanvasApp;
        } else {
          sCanvasApps = [];
        }
        if (
          sCustomList?.ImportExportXml?.CustomControls?.CustomControl != undefined
        ) {
          sCustomControls =
            sCustomList.ImportExportXml.CustomControls.CustomControl;
        } else {
          sCustomControls = [];
        }
        if (sCustomList?.ImportExportXml?.Roles?.Role != undefined) {
          sRoles = sCustomList.ImportExportXml.Roles.Role;
        } else {
          sRoles = [];
        }
        if (sCustomList?.ImportExportXml?.Languages?.Language != undefined) {
          sLanguageCode = sCustomList.ImportExportXml.Languages.Language;
        } else {
          sLanguageCode = "";
        }
  
        oSolution = {
          Flows: sCustomList.ImportExportXml.Workflows.Workflow,
          ConnectionRefs: sConnectionRefs,
          Tables: sTables,
          SecurityProfile: sSecurityProfile,
          CanvasApps: sCanvasApps,
          CustomControls: sCustomControls,
          Roles: sRoles,
          LanguageCode: sLanguageCode,
        };

        aExceptions.forEach((oFlow) => {
          if (oFlow.name == "unknown" && sCustomList != null) {
            let sFlowName;
            try {
              sFlowName = sCustomList.ImportExportXml.Workflows.Workflow.find(
                (item) =>
                  item.WorkflowId.toUpperCase() ==
                  "{" + oFlow.id + "}".toUpperCase()
              );
            } catch (error) {
              sFlowName = sCustomList.ImportExportXml.Workflows.Workflow;
            }
            if (sFlowName != null && sFlowName != undefined) {
              oFlow.name = sFlowName.Name;
            }
          }
        })
    }
  } catch (error) {
    console.log(error)
  }
}

function checkArray(key1, key2, aArray) {
  let i = 0;

  for (i = 0; i < aArray.length; i++) {
    if (!Object.hasOwn(aArray[i], key1)) {
      return false;
    }
    if (!Object.hasOwn(aArray[i], key2)) {
      return false;
    }
  }
  return true;
}
