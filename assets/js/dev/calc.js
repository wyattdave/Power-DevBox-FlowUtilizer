let iElementAutoHeight=0
let iFlows=1;

const eTemplate=document.getElementById("card-0").cloneNode(true);
const eAddLoop=document.getElementById("addLoop-button-1-0");
const eAddCondition=document.getElementById("addCond-button-1-0");
const eAddCard=document.getElementById("addFlow");

let aLoops=[{
    type:"action",
    id: 0,
    iterations:1,
    parent:0,
    actions:1,
    totalIterations:1,
    card:1
}];

eAddCard.addEventListener("click", addCard);
eAddCondition.addEventListener("click", function () {addCondition(0,1)});
eAddLoop.addEventListener("click", function () {addLoop(0,1)});
document.getElementById("action-1-0").addEventListener('change',function () {updateActions(0,1)});
document.getElementById("shrink-1").addEventListener('click',function () {shrinkCard(1)});
document.getElementById("grow-1").addEventListener('click',function () {growCard(1)});



function addLoop(iLoop,iCard){
    const iLoopCount=aLoops.filter(item => item.type === "loop" && item.card==iCard).length+1;   
    const container = document.createElement("div");
    container.style.marginLeft = "10px";
    container.style.marginRight = "2px";
    container.id="actions-div-"+iCard+"-"+iLoopCount;
    container.className="card border-black mb-3";
    container.innerHTML ="<p style='margin-left:"+(iLoop*10)+
    "px;'>Loop "+iLoopCount+"<p style='margin-left:"+(iLoop+1)*10+
    "px;'>Iterations:<input id='loop-"+iCard+"-"+iLoopCount+"' type='number' value='1'/><Button class='btn btn-dark sm' id='addLoop-button-"+iCard+"-"+iLoopCount+
    "'><i class='fa-solid fa-retweet'></i></Button><Button class='btn btn-dark sm' id='addCon-button-"+iCard+"-"+iLoopCount+
    "'><i class='fa-solid fa-arrow-right-arrow-left'></i></Button><Button class='btn btn-dark sm' id='delete-button-"+iCard+"-"+iLoopCount+
    "'><i class='fa-solid fa-trash-can'></i></Button></p><p style='margin-left:"+(iLoop+1)*10+
    "px;'>Child actions:<input id='action-"+iCard+"-"+iLoopCount+"' type='number' value='1'/></p>"

    document.getElementById("actions-div-"+iCard+"-"+iLoop).appendChild(container);
    console.log("addLoop-button-"+iCard+"-"+iLoopCount)
    document.getElementById("addLoop-button-"+iCard+"-"+iLoopCount).addEventListener('click',function () {addLoop(iLoopCount,iCard)});
    document.getElementById("addCon-button-"+iCard+"-"+iLoopCount).addEventListener('click',function () {addCondition(iLoopCount,iCard)});
    document.getElementById("delete-button-"+iCard+"-"+iLoopCount).addEventListener('click',function () {deleteContainer(iLoopCount,iCard)});
    document.getElementById("loop-"+iCard+"-"+iLoopCount).addEventListener('change',function () {updateIterations(iLoopCount,iCard)});
    document.getElementById("action-"+iCard+"-"+iLoopCount).addEventListener('change',function () {updateActions(iLoopCount,iCard)});
    aLoops.push(
        {
            type:"loop",
            id: iLoopCount,
            iterations:1,
            parent:iLoop,
            actions:1,
            totalIterations:1,
            card:iCard
        }
    )  
}

function addCondition(iCon,iCard){
    const iConCount=aLoops.filter(item => item.type === "condition" && item.card==iCard).length+1;   
    const container = document.createElement("div");
    container.style.marginLeft = "10px";
    container.style.marginRight = "2px";
    container.id="actions-div-"+iCard+"-"+iConCount;
    container.className="card border-black mb-3";
    container.innerHTML ="<p style='margin-left:"+(iCon*10)+
    "px;'>Condition "+iConCount+"<p style='margin-left:"+(iCon+1)*10+
    "px;'>Yes %&nbsp;<input id='conY-"+iCard+"-"+iConCount+"' type='number' value='50' style='width:90px'/>&nbsp;&nbsp;No %&nbsp;<input id='conN-"+iCard+"-"+iConCount+"' type='number' value='50' style='width:90px'/><Button class='btn btn-dark sm' id='addLoop-button-"+iCard+"-"+iConCount+
    "'><i class='fa-solid fa-retweet'></i></Button><Button class='btn btn-dark sm' id='addCon-button-"+iCard+"-"+iConCount+
    "'><i class='fa-solid fa-arrow-right-arrow-left'></i></Button><Button class='btn btn-dark sm' id='delete-button-"+iCard+"-"+iConCount+
    "'><i class='fa-solid fa-trash-can'></i></Button></p><p style='margin-left:"+(iCon+1)*10+
    "px;'>Yes child actions:&nbsp;<input id='actionY-"+iCard+"-"+iConCount+"' type='number' value='1'  style='width:90px'/>No child actions&nbsp;<input id='actionN-"+iCard+"-"+iConCount+"' type='number' value='1'  style='width:90px'/></p>"

    document.getElementById("actions-div-"+iCard+"-"+iCon).appendChild(container);
    document.getElementById("addLoop-button-"+iCard+"-"+iConCount).addEventListener('click',function () {addLoop(iConCount,iCard)});
    document.getElementById("addCon-button-"+iCard+"-"+iConCount).addEventListener('click',function () {addCondition(iConCount,iCard)});
    document.getElementById("delete-button-"+iCard+"-"+iConCount).addEventListener('click',function () {addCondition(iConCount,iCard)});
    document.getElementById("conY-"+iCard+"-"+iConCount).addEventListener('change',function () {updateCondition(iConCount,iCard,"y")});
    document.getElementById("actionY-"+iCard+"-"+iConCount).addEventListener('change',function () {updateCondition(iConCount,iCard,"-")});
    document.getElementById("conN-"+iCard+"-"+iConCount).addEventListener('change',function () {updateCondition(iConCount,iCard,"n")});
    document.getElementById("actionN-"+iCard+"-"+iConCount).addEventListener('change',function () {updateCondition(iConCount,iCard,"-")});
    aLoops.push(
        {
            type:"condition",
            id: iConCount,
            iterations:1,
            parent:iCon,
            actions:1,
            totalIterations:1,
            card:iCard
        }
    )  
}

function updateCondition(id,iCard,branch){
    const eYesPercentage= document.getElementById("conY-"+iCard+"-"+id);
    const eNoPercentage= document.getElementById("conN-"+iCard+"-"+id);
    if(branch=="y"){
        eNoPercentage.value=100-eYesPercentage.value;
    }else if(branch=="n"){
        eYesPercentage.value=100-eNosPercentage.value;
    } 
    const iYesActions= Math.ceil(document.getElementById("actionY-"+iCard+"-"+id).value*(eYesPercentage.value/100));
    const iNoActions= Math.floor(document.getElementById("actionN-"+iCard+"-"+id).value*(eNoPercentage.value/100));
    console.log(iYesActions,iNoActions,eYesPercentage.value,eNoPercentage.value)
    const updateItem=aLoops.find(item => item.id === id && item.card==iCard && item.type=="condition");    
    Object.assign(updateItem,
        {
            type:updateItem.type,
            id: id,
            iterations:updateItem.iterations,
            parent:updateItem.parent,
            actions:iYesActions+iNoActions+1,
            totalIterations:updateItem.iterations,
            card:iCard
        }
    )
    totalAPIs(iCard);
}

function deleteContainer(i,iCard){
    document.getElementById("actions-div-"+iCard+"-"+i).remove();
    getChildAndDelete(i,iCard);
}

function getChildAndDelete(id,iCard){
    aLoops = aLoops.filter(item => item.id !== id);
    const aDelete=aLoops.filter(item => item.parent === id && item.card==iCard); 
    aDelete.forEach(item =>{    
        getChildAndDelete(item.id,iCard)
    })
}



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
    eNewCard.querySelector("#action-1").id="action-"+id;
    eNewCard.querySelector("#addLoop-button-1-0").id="addLoop-button-"+id+"-0";
    document.getElementById("action-"+id).addEventListener('change',function () {updateActions(id)});
    document.getElementById("shrink-"+id).addEventListener('click',function () {shrinkCard(id)});
    document.getElementById("grow-"+id).addEventListener('click',function () {growCard(id)});
    document.getElementById("addLoop-button-"+id+"-0").addEventListener("click", function () {addLoop(0,id)});
  
}


function updateActions(id,iCard){
    const updateItem=aLoops.find(item => item.id === id && item.card==iCard && item.type=="loop");    
    Object.assign(updateItem,
        {
            type:updateItem.type,
            id: id,
            iterations:updateItem.iterations,
            parent:updateItem.parent,
            actions:Number(document.getElementById("action-"+iCard+"-"+id).value),
            totalIterations:updateItem.iterations,
            card:iCard
        }
    )
    totalAPIs(iCard);
}

function updateIterations(id,iCard){
    const updateItem=aLoops.find(item => item.id === id && item.card==iCard);    
    Object.assign(updateItem,
        {
            type:updateItem.type,
            id: id,
            iterations:Number(document.getElementById("loop-"+id).value),
            parent:updateItem.parent,
            actions:updateItem.actions,
            totalIterations:Number(document.getElementById("loop-"+id).value),
            card:iCard
        }
    )
    totalAPIs(iCard);
}

function totalAPIs(iCard){
    const updatedData = aLoops.filter(item =>{return item.card==iCard})
    let iTotalAPIS=0;
    updatedData.forEach(item =>{
        iTotalAPIS+=(item.totalIterations*item.actions)
    })    
    document.getElementById("runs-"+iCard).innerText=iTotalAPIS; 
    console.log(iTotalAPIS);
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

function shrinkCard(id) {
    
    document.getElementById("shrink-" + id).style.display = "none";
    document.getElementById("grow-" + id).style.display = "";
    const actionsDiv = document.getElementById("actions-div-" + id);
    
    iElementAutoHeight=actionsDiv.scrollHeight ;
    actionsDiv.style.height = actionsDiv.offsetHeight + "px";

    requestAnimationFrame(() => {
        actionsDiv.style.transition = "height 0.5s ease";
        actionsDiv.style.height = "100px";
        actionsDiv.style.overflow = "hidden";
    });
    

   
}

function growCard(id) {
  
    document.getElementById("grow-" + id).style.display = "none";
    document.getElementById("shrink-" + id).style.display = "";
    const actionsDiv = document.getElementById("actions-div-" + id);
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