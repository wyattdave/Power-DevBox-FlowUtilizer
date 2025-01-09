let iElementAutoHeight=0
let iFlows=1;

const eTemplate=document.getElementById("card-0").cloneNode(true);
const eAddLoop=document.getElementById("addLoop-button-1-0");
const eAddCondition=document.getElementById("addCond-button-1-0");
const eAddCard=document.getElementById("addFlow");
const eFlowTable=document.getElementById("flow-table");

let aContainers=[{
    type:"action",
    id: 0,
    iterations:1,
    parent:0,
    actions:1,
    totalIterations:1,
    card:1
}];

let aCards=[{
    cardId:1,
    name:"Flow 1",
    dailyAPI:1,
    runAPI:1,
    actions:1,
    daily:1
}];

eAddCard.addEventListener("click", addCard);
eAddCondition.addEventListener("click", function () {addCondition(0,1)});
eAddLoop.addEventListener("click", function () {addLoop(0,1)});
document.getElementById("action-1-0").addEventListener('change',function () {updateActions(0,1)});
document.getElementById("shrink-1").addEventListener('click',function () {shrinkCard(1)});
document.getElementById("grow-1").addEventListener('click',function () {growCard(1)});
document.getElementById("daily-1").addEventListener('click',function () {updateDaily(1)});
document.getElementById("title-1").addEventListener('input', (event) => {updateCardTitle(1)});

function addCard(){
    iFlows++;
    const id=iFlows;
    document.getElementById("flow-count").innerText=id;
    const eNewCard=eTemplate.cloneNode(true);

    document.getElementById("left-section").appendChild(eNewCard);
    eNewCard.id="card-"+id;
    eNewCard.querySelector("#actions-div-1-0").id="actions-div-"+id+"-0";  
    eNewCard.querySelector("#title-1").innerText="Flow "+id;
    eNewCard.querySelector("#title-1").id="title-"+id;    
    eNewCard.querySelector("#daily-1").id="daily-"+id;
    eNewCard.querySelector("#shrink-1").id="shrink-"+id;
    eNewCard.querySelector("#grow-1").id="grow-"+id;
    eNewCard.querySelector("#apis-1").id="apis-"+id;
    eNewCard.querySelector("#runs-1").id="runs-"+id;
    eNewCard.querySelector("#action-1-0").id="action-"+id+"-0";
    eNewCard.querySelector("#addLoop-button-1-0").id="addLoop-button-"+id+"-0";
    eNewCard.querySelector("#addCond-button-1-0").id="addCond-button-"+id+"-0";
    document.getElementById("action-"+id+"-0").addEventListener('change',function () {updateActions(0,id)});
    document.getElementById("shrink-"+id).addEventListener('click',function () {shrinkCard(id)});
    document.getElementById("grow-"+id).addEventListener('click',function () {growCard(id)});
    document.getElementById("addLoop-button-"+id+"-0").addEventListener("click", function () {addLoop(0,id)});  
    document.getElementById("addCond-button-"+id+"-0").addEventListener("click", function () {addCon(0,id)});  
    document.getElementById("daily-"+id).addEventListener('click',function () {updateDaily(id)});
    document.getElementById("title-"+id).addEventListener('click',function () {updateCardTitle(id)});

    aContainers.push(
        {
            type:"action",
            id: aContainers.length+1,
            iterations:1,
            parent:0,
            actions:1,
            totalIterations:1,
            card:id
        }
    );
    aCards.push(
        {
            cardId:iFlows,
            name:"Flow "+id,
            dailyAPI:1,
            runAPI:1,
            actions:1,
            daily:1
        }
    );
    updateTable(iFlows);
}

function addLoop(iLoop,iCard){
    const iLoopCount=aContainers.filter(item => item.type === "loop" && item.card==iCard).length+1;   
    const id=aContainers.length+1
    const container = document.createElement("div");
    container.style.marginLeft = "10px";
    container.style.marginRight = "2px";
    container.id="actions-div-"+iCard+"-"+id;
    container.className="card border-black mb-3";
    container.innerHTML ="<p style='margin-left:"+(iLoop*10)+
    "px;' contenteditable='true'>Loop "+iLoopCount+"</p><p style='margin-left:"+(iLoop+1)*10+
    "px;'>Iterations:<input id='loop-"+iCard+"-"+id+"' type='number' value='1'/><Button class='btn btn-dark sm' id='addLoop-button-"+iCard+"-"+id+
    "'><i class='fa-solid fa-retweet'></i></Button><Button class='btn btn-dark sm' id='addCon-button-"+iCard+"-"+id+
    "'><i class='fa-solid fa-arrow-right-arrow-left'></i></Button><Button class='btn btn-dark sm' id='delete-button-"+iCard+"-"+id+
    "'><i class='fa-solid fa-trash-can'></i></Button></p><p style='margin-left:"+(iLoop+1)*10+
    "px;'>Child actions:<input id='action-"+iCard+"-"+id+"' type='number' value='1'/></p>"

    document.getElementById("actions-div-"+iCard+"-"+iLoop).appendChild(container);
    console.log("addLoop-button-"+iCard+"-"+iLoopCount)
    document.getElementById("addLoop-button-"+iCard+"-"+id).addEventListener('click',function () {addLoop(id,iCard)});
    document.getElementById("addCon-button-"+iCard+"-"+id).addEventListener('click',function () {addCondition(id,iCard)});
    document.getElementById("delete-button-"+iCard+"-"+id).addEventListener('click',function () {deleteContainer(id,iCard)});
    document.getElementById("loop-"+iCard+"-"+id).addEventListener('change',function () {updateIterations(id,iCard)});
    document.getElementById("action-"+iCard+"-"+id).addEventListener('change',function () {updateActions(id,iCard)});
    aContainers.push(
        {
            type:"loop",
            typeId: iLoopCount,
            id:id,
            iterations:1,
            parent:iLoop,
            actions:1,
            totalIterations:1,
            card:iCard
        }
    )  
    totalAPIs(iCard);
}

function addCondition(iCon,iCard){
    const iConCount=aContainers.filter(item => item.type === "condition" && item.card==iCard).length+1;
    let id=aContainers.length+1;
    let container = document.createElement("div");
    container.style.marginLeft = "10px";
    container.style.marginRight = "2px";
    container.id="actions-div-"+iCard+"-"+id;
    container.className="card border-black mb-3";
    container.innerHTML ="<p style='margin-left:"+(iCon*10)+
    "px;'><span id='conTitle-"+iCard+"-"+id+"' contenteditable='true'>Condition "+iConCount+"</span>&nbsp;&nbsp;<span id='conCalc-"+iCard+"-"+id+"'>Yes: 0.5, No:0.5, Condition:1</span><p style='margin-left:"+(iCon+1)*10+
    "px;'>Yes %&nbsp;<input id='con-"+iCard+"-"+id+"' type='number' value='50' min='0' max='100'/><Button class='btn btn-dark sm' id='addLoop-button-"+iCard+"-"+id+
    "'><i class='fa-solid fa-retweet'></i></Button><Button class='btn btn-dark sm' id='addCon-button-"+iCard+"-"+id+
    "'><i class='fa-solid fa-arrow-right-arrow-left'></i></Button><Button class='btn btn-dark sm' id='delete-button-"+iCard+"-"+id+
    "'><i class='fa-solid fa-trash-can'></i></Button></p><p style='margin-left:"+(iCon+1)*10+
    "px;'>Yes child actions:&nbsp;<input id='action-"+iCard+"-"+id+"' type='number' value='1'/></p>"

    document.getElementById("actions-div-"+iCard+"-"+iCon).appendChild(container);
    document.getElementById("addLoop-button-"+iCard+"-"+id).addEventListener('click',function () {addLoop(id,iCard)});
    document.getElementById("addCon-button-"+iCard+"-"+id).addEventListener('click',function () {addCondition(id,iCard)});
    document.getElementById("delete-button-"+iCard+"-"+id).addEventListener('click',function () {deleteCondition(id,iCard)});
    document.getElementById("con-"+iCard+"-"+id).addEventListener('change',function () {updateConditionPercent(id,iCard,"y")});
    document.getElementById("action-"+iCard+"-"+id).addEventListener('change',function () {updateCondition(id,iCard,"y")});
    document.getElementById("conTitle-"+iCard+"-"+id).addEventListener('input', (event) => {updateConTitle(id,iCard)});

    const idN=aContainers.length+2;
    container = document.createElement("div");
    container.style.marginLeft = "10px";
    container.style.marginRight = "2px";
    container.id="actions-div-"+iCard+"-"+idN;
    container.className="card border-black mb-3";
    container.innerHTML ="<p id='conTitle-"+iCard+"-"+idN+"' style='margin-left:"+(iCon*10)+
    "px;'>Condition "+iConCount+"</p><p style='margin-left:"+(iCon+1)*10+
    "px;'>No %&nbsp;<input id='con-"+iCard+"-"+idN+"' type='number' value='50' min='0' max='100' style='width:90px'/><Button class='btn btn-dark sm' id='addLoop-button-"+iCard+"-"+idN+
    "'><i class='fa-solid fa-retweet'></i></Button><Button class='btn btn-dark sm' id='addCon-button-"+iCard+"-"+idN+
    "'><i class='fa-solid fa-arrow-right-arrow-left'></i></Button></p><p style='margin-left:"+(iCon+1)*10+
    "px;'>No child actions&nbsp;<input id='action-"+iCard+"-"+idN+"' type='number' value='1' style='width:90px'/></p>"

    document.getElementById("actions-div-"+iCard+"-"+iCon).appendChild(container);
    document.getElementById("addLoop-button-"+iCard+"-"+idN).addEventListener('click',function () {addLoop(idN,iCard)});
    document.getElementById("addCon-button-"+iCard+"-"+idN).addEventListener('click',function () {addCondition(idN,iCard)});
    document.getElementById("con-"+iCard+"-"+idN).addEventListener('change',function () {updateConditionPercent(idN,iCard,"n")});
    document.getElementById("action-"+iCard+"-"+idN).addEventListener('change',function () {updateCondition(idN,iCard,"n")});
    aContainers.push(
        {
            type:"condition",
            typeId: iConCount,
            id:id,
            iterations:0.5,
            parent:iCon,
            actions:1,
            totalIterations:0.5,
            card:iCard
        },
        {
            type:"condition",
            typeId: iConCount,
            id:idN,
            iterations:0.5,
            parent:iCon,
            actions:1,
            totalIterations:0.5,
            card:iCard
        }
    )  
    totalAPIs(iCard);
}

function updateCardTitle(id){
    const updateItem=aCards.find(item => item.cardId === id);  
    const sTitle=document.getElementById("title-"+id).innerText;
    Object.assign(updateItem,
        {
            cardId:id,
            name:sTitle,
            dailyAPI:updateItem.dailyAPI,
            runAPI:updateItem.runAPI,
            actions:updateItem.actions,
            daily:updateItem.daily
        }
    )
    updateTable(id);
}

function updateConTitle(id,iCard){
    const sTitle=document.getElementById("conTitle-"+iCard+"-"+id).innerText;
    document.getElementById("conTitle-"+iCard+"-"+(id+1)).innerText=sTitle;
}

function updateCondition(id,iCard,branch){
    let iActions=0;
    let iYes=0;
    let iNo=0;
    let iId=0;
    if(branch=="y"){
        iActions=Number(document.getElementById("action-"+iCard+"-"+id).value);
        iYes=iActions;   
        iNo=aContainers.find(item => item.id === (id+1) && item.card==iCard).totalIterations; 
        iId=id; 
    }else if(branch=="n"){
        iActions=Number(document.getElementById("action-"+iCard+"-"+id).value);
        iYes=aContainers.find(item => item.id === (id-1) && item.card==iCard).totalIterations;   
        iNo=iActions; 
        iId=(id-1);
    } 
    const updateItem=aContainers.find(item => item.id === id && item.card==iCard);  
    Object.assign(updateItem,
        {
            type:"condition",
            typeId:updateItem.type,
            id: id,
            iterations:updateItem.iterations,
            parent:updateItem.parent,
            actions:Number(document.getElementById("action-"+iCard+"-"+id).value),
            totalIterations:updateItem.iterations,
            card:iCard
        }
    )
      
    document.getElementById("conCalc-"+iCard+"-"+iId).innerText="Actions = Yes: "+iYes+", No:"+iNo+", Condition:1";
    console.log(aContainers)
    updateDaily(iCard);
}

function updateConditionPercent(id,iCard,branch){
    let eYesPercentage;
    let eNoPercentage;
    let yId=0;
    let nId=0;
    if(branch=="y"){
        eYesPercentage=document.getElementById("con-"+iCard+"-"+id);
        eNoPercentage=document.getElementById("con-"+iCard+"-"+(id+1));
        yId=id;
        nId=id+1;
        eNoPercentage.value=(100-eYesPercentage.value);
    }else if(branch=="n"){
        eYesPercentage=document.getElementById("con-"+iCard+"-"+(id-1));
        eNoPercentage=document.getElementById("con-"+iCard+"-"+id);
        yId=id-1;
        nId=id;
        eYesPercentage.value=(100-eNoPercentage.value);
    } 

    if(Number(eYesPercentage.value)>100 || eNoPercentage.value<0){eYesPercentage.value=100;eNoPercentage.value=0}
    if(Number(eNoPercentage.value)>100 || eYesPercentage.value<0){eNoPercentage.value=100;eYesPercentage.value=0}
    const updateItem=aContainers.find(item => item.id === yId);    
    Object.assign(updateItem,
        {
            type:updateItem.type,
            id: yId,
            iterations:eYesPercentage.value/100,
            parent:updateItem.parent,
            actions:Number(document.getElementById("action-"+iCard+"-"+idY).value),
            totalIterations:eYesPercentage.value/100,
            card:iCard
        }
    )
    const updateItemN=aContainers.find(item => item.id === nId);    
    Object.assign(updateItemN,
        {
            type:updateItem.type,
            id: nId,
            iterations:eNoPercentage.value/100,
            parent:updateItem.parent,
            actions:Number(document.getElementById("action-"+iCard+"-"+idN).value),
            totalIterations:eNoPercentage.value/100,
            card:iCard
        }
    )
    updateDaily(iCard);
}

function updateActions(id,iCard){
    const updateItem=aContainers.find(item => item.id === id);    
    Object.assign(updateItem,
        {
            type:updateItem.type,
            typeId:updateItem.type,
            id: id,
            iterations:updateItem.iterations,
            parent:updateItem.parent,
            actions:Number(document.getElementById("action-"+iCard+"-"+id).value),
            totalIterations:updateItem.iterations,
            card:iCard
        }
    )
    updateDaily(iCard);
}

function updateIterations(id,iCard){
    const updateItem=aContainers.find(item => item.id === id && item.card==iCard);    
    Object.assign(updateItem,
        {
            type:updateItem.type,
            typeId:updateItem.type,
            id: id,
            iterations:Number(document.getElementById("loop-"+iCard+"-"+id).value),
            parent:updateItem.parent,
            actions:updateItem.actions,
            totalIterations:Number(document.getElementById("loop-"+iCard+"-"+id).value),
            card:iCard
        }
    )
    updateDaily(iCard);
}

function updateDaily(iCard){
    const iTotalAPIS=totalAPIs(iCard);
    const iDaily = Number(document.getElementById("daily-"+iCard).value);
    document.getElementById("apis-"+iCard).innerText=iTotalAPIS*iDaily;
    updateTable(iCard);
;}

function updateTable(id){
    const updateItem=aCards.find(item => item.cardId === id);  
    const updatedData = aContainers.filter(item =>{return item.card==id})
    let iTotalActions=0;
    updatedData.forEach(item =>{
        iTotalActions+=item.actions
    })    
    Object.assign(updateItem,
        {
            cardId:id,
            name:updateItem.name,
            dailyAPI:Number(document.getElementById("apis-"+id).innerText),
            runAPI:Number(document.getElementById("runs-"+id).innerText),
            actions:iTotalActions,
            daily:Number(document.getElementById("daily-"+id).value)
        }
    )

    let sHTML="<table class='table'><tr><th>Flow</th><th>Run API's</th><th>Daily API's</th><th>Actions</th><th>Daily Runs</th></tr>";
    aCards.forEach(item =>{
        const sRow="<tr><td>"+
        item.name+"</td><td>"+
        item.runAPI+"</td><td>"+
        item.dailyAPI+"</td><td>"+
        item.actions+"</td><td>"+
        item.daily+"</td><tr>";
        sHTML+=sRow;
    })
    sHTML+="</table>"
    eFlowTable.innerHTML=sHTML;
}



function totalAPIs(iCard){
    const updatedData = aContainers.filter(item =>{return item.card==iCard})
    let iTotalAPIS=0;
    updatedData.forEach(item =>{
        iTotalAPIS+=(item.totalIterations*item.actions)
    })    
    const aConditions = aContainers.filter(item =>{return item.card==iCard && item.type=="condition"});
    console.log(aConditions.length/2)
    iTotalAPIS+=aConditions.length/2;

    document.getElementById("runs-"+iCard).innerText=iTotalAPIS; 
    updateTable(iCard);
    return iTotalAPIS;
}

function updateTotalIterations(data) {
    const map = data.reduce((acc, obj) => {
        acc[obj.id] = obj;
        return acc;
    }, {});

    data.forEach(obj => {
        if (obj.parent === 0) {
        obj.totalIterations = obj.iterations;
        } else {    
        const parent = map[obj.parent];
        if (parent) {
            obj.totalIterations = obj.iterations * parent.totalIterations;
        } else {
            console.error(`Parent with ID ${obj.parent} not found for ID ${obj.id}`);
            obj.totalIterations = obj.iterations; 
        }
        }
    });

  return data;
}

function deleteCondition(id,iCard){
    deleteContainer(id,iCard);
    deleteContainer((id+1),iCard);
}


function deleteContainer(id,iCard){
    document.getElementById("actions-div-"+iCard+"-"+id).remove();
    getChildAndDelete(id,iCard);
}

function getChildAndDelete(id,iCard){
    aContainers = aContainers.filter(item => item.id !== id);
    const aDelete=aContainers.filter(item => item.parent === id && item.card==iCard); 
    aDelete.forEach(item =>{    
        getChildAndDelete(item.id,iCard)
    })
}

function shrinkCard(id,iCard) {
    
    document.getElementById("shrink-"+id).style.display = "none";
    document.getElementById("grow-"+id).style.display = "";
    const actionsDiv = document.getElementById("actions-div-"+id+"-0");
    
    iElementAutoHeight=actionsDiv.scrollHeight ;
    actionsDiv.style.height = actionsDiv.offsetHeight + "px";

    requestAnimationFrame(() => {
        actionsDiv.style.transition = "height 0.5s ease";
        actionsDiv.style.height = "100px";
        actionsDiv.style.overflow = "hidden";
    });   
}

function growCard(id) {
  
    document.getElementById("grow-"+id).style.display = "none";
    document.getElementById("shrink-"+id).style.display = "";
    const actionsDiv = document.getElementById("actions-div-"+id+"-0");
    actionsDiv.addEventListener("transitionend", onTransitionEnd);
    requestAnimationFrame(() => {
        actionsDiv.style.transition = "height 0.5s ease";
        actionsDiv.style.height=iElementAutoHeight+"px";        
    });
}

function onTransitionEnd(event) {
    if (event.propertyName === "height") { 
        const box = event.target;        
        box.removeEventListener("transitionend", onTransitionEnd);
        box.style.height = "auto";
    }
}