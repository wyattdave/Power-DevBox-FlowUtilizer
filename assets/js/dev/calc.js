let iElementAutoHeight=0
let iFlows=1;
let iCurrentCard=0;
let aSolutions=[];
let sSolution=createGuid();
let mode="main";
let aRunningFlows=[];
let sDaysOfWeekFilter="su|mo|tu|we|th|fr|sa";

const eTemplate=document.getElementById("card-0").cloneNode(true);
const eAddLoop=document.getElementById("addLoop-button-0-0");
const eAddCondition=document.getElementById("addCond-button-0-0");
const eAddCard=document.getElementById("addFlow");
const eFlowTable=document.getElementById("flow-table");
const eSolutionTitle=document.getElementById("solutionTable");
const eSaveSolution=document.getElementById("addSolution");
const eNewSolution=document.getElementById("newSolution");
const eSwitch=document.getElementById("switch");
const eMain=document.getElementById("main");
const eSolution=document.getElementById("solutions");
const eSolutionDaily=document.getElementById("solution-daily");
const eleftSection=document.getElementById("left-section");

let aContainers=[{
    type:"action",
    id: 0,
    iterations:1,
    parent:0,
    actions:1,
    totalIterations:1,
    branch:"n/a",
    flow:0
}];

let aCards=[{
    flowId:0,
    name:"Flow 1",
    dailyAPI:1,
    runAPI:1,
    actions:1,
    daily:1,
    solution:"Solution Name",
    on:true,
    guid:createGuid(),
    containers:aContainers.slice(),
    daysOfWeek:"su|mo|tu|we|th|fr|sa"
}];

eAddCard.addEventListener("click", function () {addCard(-1)});
eSwitch.addEventListener("click", switchMode);
eAddLoop.addEventListener("click", function () {addLoop(0,0)});
eAddCondition.addEventListener("click", function () {addCondition(0,0)});
eSolutionTitle.addEventListener('input', (event) => {updateTable(iCurrentCard)});
eSaveSolution.addEventListener('click',function () {saveSolution()});
eNewSolution.addEventListener('click',function () {newSolution()});
document.getElementById("downloadYAML").addEventListener("click", downloadYaml);
document.getElementById("action-0").addEventListener('change',function () {updateActions(0,0,true)});
document.getElementById("delete-button-card-0").addEventListener('click',function () {deleteCard(0)});
document.getElementById("shrink-0").addEventListener('click',function () {shrinkCard(0)});
document.getElementById("grow-0").addEventListener('click',function () {growCard(0)});
document.getElementById("daily-0").addEventListener('change',function () {updateDaily(0)});
document.getElementById("title-0").addEventListener('input', (event) => {updateCardTitle(0)});
document.getElementById("clear-filter").addEventListener('click',function () {updateSolutionTable("all")});
document.getElementById("close-filter-days").addEventListener('click',closePopup)
const aDaysOfWeekChecks = document.querySelectorAll("input[name='days-1']");
aDaysOfWeekChecks.forEach( item =>{
    item.addEventListener('change',function () {updateCard(1)});
})
const aDaysOfWeekChecksFilter = document.querySelectorAll("input[name='-filter']");

if(!localStorage.getItem("solutions")){
    localStorage.setItem("solutions","[]");
}else{
    aSolutions=JSON.parse(localStorage.getItem("solutions"));
}

function switchMode(){
    if(mode=="main"){
        updateSolutionTable("all");
        eMain.style.display="none";
        eSolution.style.display="block";
        eSwitch.innerText="View Flows";
        mode="solution";
    }else{
        eSolution.style.display="none";
        eMain.style.display="block";        
        eSwitch.innerText="View Solutions";
        mode="main";
    }
}

function addCard(id){
    let bNew=true;
    if(id==-1){
        iFlows++;
        id=createGuid();
        closeOtherCards(id);
    }else{
        iFlows=id;
        bNew=false;
    }
    
    document.getElementById("flow-count").innerText=id;
    const eNewCard=eTemplate.cloneNode(true);

    eleftSection.appendChild(eNewCard);
    eNewCard.id="card-"+id;    
    eNewCard.querySelector("#actions-div-0-0").id="actions-div-"+id+"-0";  
    eNewCard.querySelector("#title-0").innerText="Flow "+id;
    eNewCard.querySelector("#title-0").id="title-"+id;    
    eNewCard.querySelector("#daily-0").id="daily-"+id;
    eNewCard.querySelector("#shrink-0").id="shrink-"+id;
    eNewCard.querySelector("#grow-0").id="grow-"+id;
    eNewCard.querySelector("#apis-0").id="apis-"+id;
    eNewCard.querySelector("#runs-0").id="runs-"+id;
    eNewCard.querySelector("#action-0").id="action-"+id;
    eNewCard.querySelector("#delete-button-card-0").id="delete-button-card-"+id;
    eNewCard.querySelector("#addLoop-button-0-0").id="addLoop-button-"+id+"-0";
    eNewCard.querySelector("#addCond-button-0-0").id="addCond-button-"+id+"-0";
    document.getElementById("action-"+id).addEventListener('change',function () {updateActions(0,id,true)});
    document.getElementById("shrink-"+id).addEventListener('click',function () {shrinkCard(id)});
    document.getElementById("grow-"+id).addEventListener('click',function () {growCard(id)});
    document.getElementById("addLoop-button-"+id+"-0").addEventListener("click", function () {addLoop(0,id)});  
    document.getElementById("addCond-button-"+id+"-0").addEventListener("click", function () {addCondition(0,id)});  
    document.getElementById("daily-"+id).addEventListener('click',function () {updateDaily(id)});
    document.getElementById("title-"+id).addEventListener('click',function () {updateCardTitle(id)});
    document.getElementById("delete-button-card-"+id).addEventListener('click',function () {deleteCard(id)});

    const aDaysOfWeek = eNewCard.querySelectorAll("input[name='days-0']");
    aDaysOfWeek.forEach( item =>{
        item.name="days-"+id;
        item.addEventListener('change',function () {updateCard(id)});
    })

    if(bNew){
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
                flowId:id,
                name:"Flow "+id,
                dailyAPI:1,
                runAPI:1,
                actions:1,
                daily:1,
                solution:eSolutionTitle.innerText,
                on:true,
                guid:createGuid(),
                containers:aContainers.filter(item => item.flow==iFlows).slice(),
                daysOfWeek:"su|mo|tu|we|th|fr|sa"
            }
        );
    }
    updateTable(id);
}

function addLoop(iLoop,iCard){
    const iLoopCount=aContainers.filter(item => item.type === "loop" && item.flow==iCard).length+1;   
    const id=aContainers.length;
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
    document.getElementById("action-"+iCard+"-"+id).addEventListener('change',function () {updateActions(id,iCard,false)});
    aContainers.push(
        {
            type:"loop",
            typeId: iLoopCount,
            id:id,
            iterations:1,
            parent:iLoop,
            actions:1,
            totalIterations:1,
            flow:iCard,
            branch:"n/a"
        }
    )  
    totalAPIs(iCard);
    updateDaily(iCard);
    updateCard(iCard);
}

function addCondition(iCon,iCard){
    const iConCount=aContainers.filter(item => item.type === "condition" && item.flow==iCard).length+1;
    let id=aContainers.length;
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

    const idN=aContainers.length+1;
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
            flow:iCard,
            branch:"yes"
        },
        {
            type:"condition",
            typeId: iConCount,
            id:idN,
            iterations:0.5,
            parent:iCon,
            actions:1,
            totalIterations:0.5,
            flow:iCard,
            branch:"no"
        }
    )  
    totalAPIs(iCard);
    updateDaily(iCard);
    updateCard(iCard);
}

function updateSolutionTable(sFilter){
    aRunningFlows.length=0;
    let sTableSolutions="<table class='table'><tr><th>Solution</th><th>Flows</th><th>Daily APIS's</th><th>Modified</th><th></th></tr>";
    let sTableFlows="<table class='table'><tr><th>Solution</th><th>Flow</th><th>Run API's</th><th>Daily APIS's</th><th>Include</th></tr>";
    aSolutions.forEach(sol =>{    
        let sRow="<tr><td id='solution-"+sol.solutionId+"'>"+
        sol.solutionName+"</td><td>"+
        sol.flows.length+"</td><td>"+
        sol.dailyAPI+"</td><td>"+
        sol.modified+"</td><td>"+
        "<Button class='btn btn-dark sm' id='delete-solution-"+sol.solutionId+"' style='margin-right:5px;'><i class='fa-solid fa-trash-can'></i></Button>"+
        "<Button class='btn btn-dark sm' id='filter-solution-"+sol.solutionId+"'><i class='fa-solid fa-filter'></i></Button>";
        sTableSolutions+=sRow;
        if(sol.solutionId==sFilter || sFilter=="all"){
            sol.flows.forEach(flow =>{
                const aDays=flow.daysOfWeek.split("|");
                let bDayFound=false;
                aDays.forEach(item =>{
                    if(sDaysOfWeekFilter.includes(item)){
                        bDayFound=true
                        console.log(flow.name+" "+item+ " found")
                    }else{
                        console.log(flow.name+" "+item)
                    }
                })
                if(bDayFound){
                    let sRow="<tr><td>"+
                    flow.solution+"</td><td>"+
                    flow.name+"</td><td>"+
                    flow.runAPI+"</td><td>"+
                    flow.dailyAPI+"</td><td>"+
                    "<div class='form-check form-switch'><input class='form-check-input' type='checkbox' role='switch' id='flow-"+flow.guid+"' checked><label class='form-check-label' for='flow-"+flow.guid+"'></label></div></td></tr>";
                    if(!flow.on){sRow=sRow.replace(" checked>",">")}
                    sTableFlows+=sRow
                }
            })
        }
    })
    document.getElementById("left-table").innerHTML=sTableSolutions+"</table>";
    document.getElementById("right-table").innerHTML=sTableFlows+"</table>";
    aSolutions.forEach(sol =>{       
        document.getElementById("filter-solution-"+sol.solutionId).addEventListener('click', function () {           
            updateSolutionTable(sol.solutionId);
        });
        document.getElementById("delete-solution-"+sol.solutionId).addEventListener('click', function () {           
            deleteSolution(sol.solutionId);
        })
        document.getElementById("solution-"+sol.solutionId).addEventListener('click', function () {           
            loadSolution(sol.solutionId);
        })
        if(sol.solutionId==sFilter || sFilter=="all"){
            sol.flows.forEach(flow =>{
                document.getElementById("flow-"+flow.guid).addEventListener('change', function () {
                    flow.on=this.checked;  
                    updateTotals();                 
                });             
                aRunningFlows.push(flow)
            })
        }
    })    
    updateTotals();
}

function updateTotals(){
    const aFilteredFlows=aRunningFlows.filter(item => item.on)
    let sHTML="<p>Total Daily Runs:"+aFilteredFlows.reduce((sum, item) => sum + item.dailyAPI, 0)+
    "</p><p>Running Flows:"+aFilteredFlows.length+"</p>"
    document.getElementById("left-totals").innerHTML=sHTML;
}

function deleteSolution(id){
    aSolutions=aSolutions.filter(item => {return item.solutionId !=id})
    localStorage.setItem("solutions",aSolutions);
    updateSolutionTable("all");
}

function updateCardTitle(id){
    const updateItem=aCards.find(item => item.flowId === id);  
    const sTitle=document.getElementById("title-"+id).innerText;
    const sDaysOfWeek=getSelectedDays(id);
    Object.assign(updateItem,
        {
            flowdId:id,
            name:sTitle,
            dailyAPI:updateItem.dailyAPI,
            runAPI:updateItem.runAPI,
            actions:updateItem.actions,
            daily:updateItem.daily,
            solutionId:updateItem.solution,
            on:true,
            guid:createGuid(),
            containers:updateItem.containers,
            daysOfWeek:sDaysOfWeek
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
        iNo=aContainers.find(item => item.id === (id+1) && item.flow==iCard).totalIterations; 
        iId=id; 
    }else if(branch=="n"){
        iActions=Number(document.getElementById("action-"+iCard+"-"+id).value);
        iYes=aContainers.find(item => item.id === (id-1) && item.flow==iCard).totalIterations;   
        iNo=iActions; 
        iId=(id-1);
    } 
    const updateItem=aContainers.find(item => item.id === id && item.flow==iCard);  
    Object.assign(updateItem,
        {
            type:"condition",
            typeId:updateItem.type,
            id: id,
            iterations:updateItem.iterations,
            parent:updateItem.parent,
            actions:Number(document.getElementById("action-"+iCard+"-"+id).value),
            totalIterations:updateItem.iterations,
            flow:iCard,
            branch:updateItem.branch
        }
    )
      
    document.getElementById("conCalc-"+iCard+"-"+iId).innerText="Actions = Yes: "+iYes+", No:"+iNo+", Condition:"+(iYes+iNo)/2;
    console.log(aContainers)
    updateDaily(iCard);
}
//change
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
            actions:Number(document.getElementById("action-"+iCard+"-"+yId).value),
            totalIterations:eYesPercentage.value/100,
            flow:iCard,
            branch:"yes"
        }
    )
    const updateItemN=aContainers.find(item => item.id === nId);    
    Object.assign(updateItemN,
        {
            type:updateItem.type,
            id: nId,
            iterations:eNoPercentage.value/100,
            parent:updateItem.parent,
            actions:Number(document.getElementById("action-"+iCard+"-"+nId).value),
            totalIterations:eNoPercentage.value/100,
            flow:iCard,
            branch:"no"
        }
    )
    updateDaily(iCard);
}

function updateActions(id,iCard,root){
    const updateItem=aContainers.find(item => item.id === id);    
    let iActions=0;
    if(root){
        iActions=Number(document.getElementById("action-"+iCard).value)
    }else{
        iActions=Number(document.getElementById("action-"+iCard+"-"+id).value)
    }
    Object.assign(updateItem,
        {
            type:updateItem.type,
            typeId:updateItem.type,
            id: id,
            iterations:updateItem.iterations,
            parent:updateItem.parent,
            actions:iActions,
            totalIterations:updateItem.iterations,
            flow:iCard,
            branch:updateItem.branch
        }
    )
    updateDaily(iCard);
}

function updateCard(id){
    const updateItem=aCards.find(item => item.flowId === id);  
    const sDaysOfWeek=getSelectedDays(id);
    Object.assign(updateItem,
        {
            flowId:updateItem.flowId,
            name:updateItem.name,
            dailyAPI:updateItem.dailyAPI,
            runAPI:updateItem.runAPI,
            actions:updateItem.actions,
            daily:updateItem.daily,
            solution:updateItem.solution,
            on:updateItem.on,
            guid:updateItem.guid,
            containers:aContainers.filter(item => item.flow==id),
            daysOfWeek:sDaysOfWeek 
        }
    )
    updateTable(id);
}

function updateIterations(id,iCard){
    const updateItem=aContainers.find(item => item.id === id && item.flow==iCard);    
    Object.assign(updateItem,
        {
            type:updateItem.type,
            typeId:updateItem.type,
            id: id,
            iterations:Number(document.getElementById("loop-"+iCard+"-"+id).value),
            parent:updateItem.parent,
            actions:updateItem.actions,
            totalIterations:Number(document.getElementById("loop-"+iCard+"-"+id).value),
            flow:iCard,
            branch:updateItem.branch
        }
    )
    updateDaily(iCard);
}

function updateDaily(iCard){
    const iTotalAPIS=totalAPIs(iCard);
    const iDaily = Number(document.getElementById("daily-"+iCard).value);
    document.getElementById("apis-"+iCard).innerText=iTotalAPIS*iDaily;    
;}

function updateTable(id){
    const sDaysOfWeek=getSelectedDays(id);
    const updateItem=aCards.find(item => item.flowId === id);  
    const updatedData = aContainers.filter(item =>{return item.flow==id})
    let iTotalActions=0;
    updatedData.forEach(item =>{
        iTotalActions+=item.actions
    })    
    Object.assign(updateItem,
        {
            flowId:id,
            name:updateItem.name,
            dailyAPI:Number(document.getElementById("apis-"+id).innerText),
            runAPI:Number(document.getElementById("runs-"+id).innerText),
            actions:iTotalActions,
            daily:Number(document.getElementById("daily-"+id).value),
            solution:eSolutionTitle.innerText,
            on:true,
            guid:createGuid(),
            containers:updateItem.containers,
            daysOfWeek:sDaysOfWeek
        }
    )
    let sHTML="<table class='table'><tr><th>Flow</th><th>Run API's</th><th>Daily API's</th><th>Actions</th><th>Daily Runs</th><th>Days</th></tr>";
    aCards.forEach(item =>{
        const sRow="<tr><td>"+
        item.name+"</td><td>"+
        item.runAPI+"</td><td>"+
        item.dailyAPI+"</td><td>"+
        item.actions+"</td><td>"+
        item.daily+"</td><td>"+
        item.daysOfWeek+"</td></tr>";
        sHTML+=sRow;
    })
    sHTML+="</table>"
    eFlowTable.innerHTML=sHTML;
    eSolutionDaily.innerText="Total Daily API: "+aCards.reduce((sum, item) => sum + item.dailyAPI, 0);
    
}

function loadSolution(id){

    const oSolution=aSolutions.find(item =>{return item.solutionId==id});
    console.log(oSolution)
    sSolution=oSolution.solutionId;
    aCards=oSolution.flows;
    aContainers.length=0;    
    eleftSection.innerHTML="";   
    eSolutionTitle.innerText=oSolution.solutionName;
    aCards.forEach(card => {
        addCard(card.flowId);
        card.containers.forEach(item =>{
            console.log(item)
            let eActions;
            switch(item.type){
                case "loop":
                    addLoop(item.parent,card.flowId)
                    const eLoop = document.getElementById("loop-"+card.flowId+"-"+item.parent);
                    eActions=document.getElementById("action-"+card.flowId+"-"+item.parent);
                    eLoop.value=item.iterations;                    
                    eActions.value=item.actions;
                    break;
                case "condition":
                    if(item.branch=="yes"){
                        addCondition(item.parent,card.flowId)
                        console.log("con-"+card.flowId+"-"+item.id)
                        const eCon = document.getElementById("con-"+card.flowId+"-"+item.id);
                        eActions=document.getElementById("action-"+card.flowId+"-"+item.id);
                        eCon.value=item.iterations;
                        eActions.value=item.actions;
                    }                   
                    break
                case "action":
                    eActions=document.getElementById("action-"+card.flowId);
                    eActions.value=item.actions;
                    break
            }
                
        })
    })
    closeOtherCards(1);
    switchMode();
}

function totalAPIs(iCard){
    const updatedData = aContainers.filter(item =>{return item.flow==iCard})
    let iTotalAPIS=0;
    updatedData.forEach(item =>{
        iTotalAPIS+=(item.totalIterations*item.actions)
    })    
    const aConditions = aContainers.filter(item =>{return item.flow==iCard && item.type=="condition"});
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

function deleteCard(iCard){
    document.getElementById("card-"+iCard).remove();
    aContainers = aContainers.filter(item => item.flow != iCard);
    aCards=aCards.filter(item => item.flowId !=iCard);
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
    const aDelete=aContainers.filter(item => item.parent === id && item.flow==iCard); 
    aDelete.forEach(item =>{    
        getChildAndDelete(item.id,iCard)
    })
}

function getSelectedDays(iCard) {
    const checkboxes = document.querySelectorAll("input[name='days-"+iCard+"']:checked");
    const selectedDays = Array.from(checkboxes).map(checkbox => checkbox.value);
    return selectedDays.join('|') || '';
}

function shrinkCard(id) {   
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
    iCurrentCard=id
    document.getElementById("grow-"+id).style.display = "none";
    document.getElementById("shrink-"+id).style.display = "";
    const actionsDiv = document.getElementById("actions-div-"+id+"-0");
    actionsDiv.addEventListener("transitionend", onTransitionEnd);
    requestAnimationFrame(() => {
        actionsDiv.style.transition = "height 0.5s ease";
        actionsDiv.style.height=iElementAutoHeight+"px";        
    });
    closeOtherCards(id);
}

function closeOtherCards(id){
    const aOtherCards=aCards.filter(item => {return item.flow!=id});
    aOtherCards.forEach(item => {shrinkCard(item.flowId)});
}

function onTransitionEnd(event) {
    if (event.propertyName === "height") { 
        const box = event.target;        
        box.removeEventListener("transitionend", onTransitionEnd);
        box.style.height = "auto";
    }
}

function saveSolution(){
    const updateItem=aSolutions.find(item => item.solutionId==sSolution);
    if(updateItem){
        Object.assign(updateItem,
            {
                solutionName:eSolutionTitle.innerText,
                solutionId:sSolution,
                flows:aCards.slice(),
                dailyAPI:aCards.reduce((sum, item) => sum + item.dailyAPI, 0),
                modified:getNow()
            }
        );
        alert(eSolutionTitle.innerText+" updated")
    }else{
        aSolutions.push({
            solutionName:eSolutionTitle.innerText,
            solutionId:sSolution,
            flows:aCards.slice(),
            dailyAPI:aCards.reduce((sum, item) => sum + item.dailyAPI, 0),
            modified:getNow()
        });
        alert(eSolutionTitle.innerText+" created")
    }
    localStorage.setItem("solutions",JSON.stringify(aSolutions));
}

function newSolution(){
    aContainers=[{
        type:"action",
        id: 0,
        iterations:1,
        parent:0,
        actions:1,
        totalIterations:1,
        flow:1,
        branch:"n/a"
    }];
    aCards=[{
        flowId:1,
        name:"Flow 1",
        dailyAPI:1,
        runAPI:1,
        actions:1,
        daily:1,
        solution:"Solution Name",
        on:true,
        guid:createGuid(),
        containers:aContainers.slice(),
        daysOfWeek:"su|mo|tu|we|th|fr|sa"
    }];
    iFlows=1;
    eleftSection.innerHTML="";
    addCard(0)

}

function downloadYaml(){
    const oSolution= {
        solutionName:eSolutionTitle.innerText,
        solutionId:sSolution,
        flows:aCards.slice(),
        dailyAPI:aCards.reduce((sum, item) => sum + item.dailyAPI, 0),
        modified:getNow()
    }
    const sYAML=jsonToYaml(oSolution);
    downloadYaml(sYAML,eSolutionTitle.innerText+".yaml")
}

function createGuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getNow(){
    const dtNow=new Date();

    const sNow= String(dtNow.getDay()).padStart(2, '0')+"/"+String(dtNow.getMonth()+1).padStart(2, '0')+
    " - "+String(dtNow.getHours()).padStart(2, '0')+
    ":"+String(dtNow.getMinutes()).padStart(2, '0');

    console.log(sNow)
    return sNow
}

function openPopup(button) {
    const popup = document.getElementById("daysPopup");
    popup.style.display = "block";
    const buttonRect = button.getBoundingClientRect();
    popup.style.top = buttonRect.bottom + "px";
    popup.style.left = buttonRect.left + "px";
    const windowWidth = window.innerWidth;
    const popupWidth = popup.offsetWidth;
    if (buttonRect.left + popupWidth > windowWidth) {
        popup.style.left = windowWidth - popupWidth + "px";
    }
}

function closePopup() {
    const checkboxes = document.querySelectorAll("input[name='days-filter']:checked");
    const selectedDays = Array.from(checkboxes).map(checkbox => checkbox.value);
    sDaysOfWeekFilter=selectedDays.join('|') || '';
    console.log(sDaysOfWeekFilter)
    document.getElementById("daysPopup").style.display = "none";
}