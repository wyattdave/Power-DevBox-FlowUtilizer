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
let aImportFlows=[];
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

async function unpackNestedZipFiles(file, bUpdate) {
 // try {
    aImportFlows=[];
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
          } else if (entry.filename.includes("solution.xml")) {
            review(entry, "solution", fileData,false);
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
      console.log(aImportFlows)
      let bSave=true;
      const existingIndex = aSolutions.findIndex(item => item.solutionId == oDependencies.ImportExportXml.SolutionManifest.UniqueName);
      if (existingIndex !== -1) {
        if (confirm('This upload will replace existing solution and wipe all iterations/mixes/days of week. Do you want to continue?')) {
          aSolutions.splice(existingIndex, 1);
        } else {
          bSave=false;
        }
      }

      if(bSave){
        let aFlowCards=[];
        aImportFlows.forEach((oFlow) => {
          oFlow.actionArray.forEach((oAction) => {
            const oParent=getParent(oAction,oFlow.actionArray,"");
            oAction.parent=oParent.parent;
            oAction.branch=oParent.branch;
            oAction.parentId=oParent.parentId;
          })

          const aActions=oFlow.actionArray.filter(item =>{
            return ( item.type!="Foreach" &&  item.type!="Switch" &&  item.type!="If" && item.type!="Until" )
          })
          const aContainers=oFlow.actionArray.filter(item =>{
            return ( item.type=="Foreach" ||  item.type=="Switch"||  item.type=="If" ||  item.type=="Until") 
          })
          let iDaily=1;
          if(oFlow.triggerNote.includes("Daily Runs:")){
            iDaily=parseInt(oFlow.triggerNote.split("Daily Runs:")[1].split("|")[0].trim());
          }

          let aFlowContainers=[{
            type:"action",
            name:"Root Actions",
            id: "0",
            iterations:1,
            parent:"0",
            actions:aActions.filter(action =>{return action.parentId=="0" }).length,
            totalCalls:aActions.filter(action =>{return action.parentId=="0" }).length*iDaily,
            branch:"y",
            flow:oFlow.id
          }];

          aContainers.forEach(item => {
            let iIterations=1;
            let iYes=.5;
            let iNo=.5
            const iLevel=item.positionIndex.split("|").length-1;
            const sId=item.hashId.replace("MISSING",oFlow.id);
            const sParentId=item.parentId.replace("MISSING",oFlow.id);
            const iActionsY=aActions.filter(action =>{return action.parent==item.name && (action.branch == "y" || action.branch=="")}).length;
            const iActionsN=aActions.filter(action =>{return action.parent==item.name  && action.branch =="n"}).length;
            if(convertContainer(item.type)=="condition"){
              if(item.notes.includes("Ratio:")){
                const sRatio=oFlow.triggerNote.split("Ratio:")[1].split("|")[0];
                if (sRatio.includes("/")){
                  iYes=parseInt(sRatio.split("/")[0].trim());
                  iNo=parseInt(sRatio.split("/")[1].trim());
                }
                if(iYes>1 || iNo>1){
                  iYes=iYes/100;
                  iNo=iNo/100;
                }
              }              
              
              let  iTotalCalls=Math.ceil(iActionsY*iYes);
              if(iTotalCalls==NaN){iTotalCalls=0}
              aFlowContainers.push({
                type:convertContainer(item.type),
                name:item.name,
                id: sId,
                iterations:iNo,
                parent:sParentId,
                actions:iActionsY,
                totalCalls:iTotalCalls+1,
                branch:"y",
                flow:oFlow.id,
                level:iLevel
              })
              iTotalCalls=Math.ceil(iActionsN*iYes);
              if(iTotalCalls==NaN){iTotalCalls=0}
              aFlowContainers.push({
                type:convertContainer(item.type),
                name:item.name,
                id: sId+"-n",
                iterations:iNo,
                parent:sParentId,
                actions:iActionsN,
                totalCalls:iTotalCalls,
                branch:"n",
                flow:oFlow.id,
                level:iLevel
              })
            }else{

              if(item.notes.includes("Iterations:")){
                iIterations=parseInt(oFlow.triggerNote.split("Iterations:")[1].split("|")[0].trim());
              }
              aFlowContainers.push({
                type:convertContainer(item.type),
                name:item.name,
                id: sId,
                iterations:iIterations,
                parent:sParentId,
                actions:iActionsY,
                totalCalls:iIterations*aActions.filter(action =>{return action.parent==item.name && (action.branch == "y" || action.branch=="")}).length+1,
                branch:"y",
                flow:oFlow.id,
                level:iLevel
              })
            }
          })

          let iTotalAPIS=0;
          aFlowContainers.forEach(item =>{
              iTotalAPIS+=item.totalCalls
          })    
          console.log(oFlow.actionArray,oFlow.actionArray.length)
          aFlowCards.push({
            flowId:oFlow.id,
            name:oFlow.name,
            dailyCalls:Number((iDaily*iTotalAPIS).toFixed()),
            runCalls:Number(iTotalAPIS.toFixed()),
            actions:oFlow.actionArray.length,
            dailyRuns:Number(iDaily),
            solution:oDependencies.ImportExportXml.SolutionManifest.UniqueName,
            on:true,
            containers:aFlowContainers.slice(),
            daysOfWeek:"su|mo|tu|we|th|fr|sa"
          })
          console.log(aFlowCards)
        })

        aSolutions.push({
          solutionName:oDependencies.ImportExportXml.SolutionManifest.UniqueName,
          solutionId:oDependencies.ImportExportXml.SolutionManifest.UniqueName,
          flows:aFlowCards,
          dailyCalls:aFlowCards.reduce((sum, item) => sum + item.dailyCalls, 0),
          modified:getNow()
        });
    
        loadSolution(oDependencies.ImportExportXml.SolutionManifest.UniqueName);
        switchMode();
        localStorage.setItem("solutions",JSON.stringify(aSolutions));
      }
    } else {
      alert("No a Zip file");
      console.log(file.name);
    }
    try{
  } catch (error) {
    console.log(error.message);
    alert( "Unexpected Error: " + error.message);
 }
}


function getParent(object,array,parents){
  if(object.parent=="Create_New_Site_2"){
    console.log(parents)
  }
  const oParent=array.find(item =>{return item.name==object.parent});
  if(oParent==undefined){
    return {"parentId":"0","parent":"root","branch":"Yes", "parents":"root|"+parents};
  }
  if (oParent.type=="Scope"){
    return getParent(oParent,array,parents+"|"+oParent.name)
  }else{
    return {"parentId":oParent.hashId,"parent":oParent.name,"branch":object.branch, "parents":parents+"|"+oParent.name};
  }
}

function convertContainer(sType){
  switch(sType){
    case "Foreach":
      return "loop";
    case "Switch":
      return "condition";
    case "If":
      return "condition";
    case "Until":
      return "loop";
    default:
      return "Action";
  }
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
          aImportFlows.push(oReport);
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

        aImportFlows.forEach((oFlow) => {
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
    } else if (type == "solution") {
      oDependencies = xmlToJson.parse(sDefinition);
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
