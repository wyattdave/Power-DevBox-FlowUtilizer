let iElementAutoHeight=0
let iCurrentCard=0;
let aSolutions=[];
let sSolution=createGuid();
let mode="main";
let aRunningFlows=[];
let sDaysOfWeekFilter="su|mo|tu|we|th|fr|sa";
let sCurrentFilter="all";
let sSolutionFilterId="all";
let bRefresh=false;

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
const eCharts=document.getElementById("charts");
const eChartsButton=document.getElementById("chart-button");

let aContainers=[{
    type:"action",
    name:"Root Actions",
    id: "0",
    iterations:1,
    parent:"0",
    actions:1,
    totalCalls:1,
    branch:"y",
    flow:"0",
    level:0
}];

let aCards=[{
    flowId:"0",
    name:"Flow 1",
    dailyCalls:1,
    runCalls:1,
    actions:1,
    dailyRuns:1,
    solution:"Solution Name",
    on:true,
    containers:JSON.parse(JSON.stringify(aContainers)),
    daysOfWeek:"su|mo|tu|we|th|fr|sa"
}];

eAddCard.addEventListener("click", function () {addCard({},{})});
eSwitch.addEventListener("click", switchMode);
eAddLoop.addEventListener("click", function () {addLoop("0","0",{},1)});
eAddCondition.addEventListener("click", function () {addCondition("0","0",{},{},1)});
eSolutionTitle.addEventListener('input', (event) => {updateTable(iCurrentCard)});
eSaveSolution.addEventListener('click',function () {saveSolution()});
eNewSolution.addEventListener('click',function () {newSolution()});
eChartsButton.addEventListener('click',switchChart);
document.getElementById("downloadYAML").addEventListener("click", downloadSolution);
document.getElementById("title-0").addEventListener('click',function () {updateCardTitle("0")});
document.getElementById("action-0").addEventListener('change',function () {updateActions("0","0",true)});
document.getElementById("delete-button-card-0").addEventListener('click',function () {deleteCard("0")});
document.getElementById("shrink-0").addEventListener('click',function () {shrinkCard("0")});
document.getElementById("grow-0").addEventListener('click',function () {growCard("0")});
document.getElementById("daily-0").addEventListener('change',function () {updateCard("0")});
document.getElementById("title-0").addEventListener('input', (event) => {updateCardTitle("0")});
document.getElementById("clear-filter").addEventListener('click',function () {updateSolutionTable("all")});
document.getElementById("close-filter-days").addEventListener('click',closePopup);
document.getElementById("import-solution").addEventListener('click',importSolution);


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
        sCurrentFilter="all";
        updateSolutionTable("all");
        eMain.style.display="none";
        eSolution.style.display="block";
        eSwitch.innerText="View Flows";
        sDaysOfWeekFilter="su|mo|tu|we|th|fr|sa";
        mode="solution";
    }else{
        eSolution.style.display="none";
        eMain.style.display="block";        
        eSwitch.innerText="View Solutions";
        mode="main";
        eChartsButton.innerText="View Charts"; 
        eCharts.style.display="none";
    }
}

function switchChart(){
    if(mode=="charts"){
        sCurrentFilter="all";
        updateSolutionTable("all");
        eCharts.style.display="none";
        eSolution.style.display="block";
        eSwitch.innerText="View Flows";
        eChartsButton.innerText="View Charts"; 
        sDaysOfWeekFilter="su|mo|tu|we|th|fr|sa";
        mode="solution";
    }else{
        loadCharts(bRefresh)
        eSolution.style.display="none";
        eMain.style.display="none";
        eCharts.style.display="block";   
        eSwitch.innerText="View Flows"; 
        eChartsButton.innerText="View Solutions"; 
        mode="charts";
        bRefresh=true;
    }
}

function addCard(oFlow,oContainer){
    if(JSON.stringify(oFlow)=="{}"){
        oFlow={
            name:"Flow "+(aCards.length+1),
            flowId:createGuid(),
            dailyCalls:1,
            runCalls:1,
            actions:1,
            dailyRuns:1,
            solution:"Solution Name",
            on:true,
            containers:[],
            daysOfWeek:"su|mo|tu|we|th|fr|sa"
        };

        oContainer={
            type:"action",
            name:"Root Actions",
            id: createGuid(),
            iterations:1,
            parent:"0",
            actions:1,
            totalCalls:1,
            flow:oFlow.flowId,
            level:0
        }
    }   
    document.getElementById("flow-count").innerText=aCards.length;
    const eNewCard=eTemplate.cloneNode(true);

    eleftSection.appendChild(eNewCard);
    eNewCard.id="card-"+oFlow.flowId;    
    eNewCard.querySelector("#actions-div-0-0").id="actions-div-"+oFlow.flowId+"-0";  
    eNewCard.querySelector("#title-0").innerText=oFlow.name;
    eNewCard.querySelector("#title-0").id="title-"+oFlow.flowId;    
    eNewCard.querySelector("#daily-0").id="daily-"+oFlow.flowId;
    eNewCard.querySelector("#shrink-0").id="shrink-"+oFlow.flowId;
    eNewCard.querySelector("#grow-0").id="grow-"+oFlow.flowId;
    eNewCard.querySelector("#apis-0").id="apis-"+oFlow.flowId;
    eNewCard.querySelector("#runs-0").id="runs-"+oFlow.flowId;
    eNewCard.querySelector("#action-0").id="action-"+oFlow.flowId;
    eNewCard.querySelector("#delete-button-card-0").id="delete-button-card-"+oFlow.flowId;
    eNewCard.querySelector("#addLoop-button-0-0").id="addLoop-button-"+oFlow.flowId+"-0";
    eNewCard.querySelector("#addCond-button-0-0").id="addCond-button-"+oFlow.flowId+"-0";
    document.getElementById("action-"+oFlow.flowId).addEventListener('change',function () {updateActions(oContainer.id,oFlow.flowId,true)});
    document.getElementById("shrink-"+oFlow.flowId).addEventListener('click',function () {shrinkCard(oFlow.flowId)});
    document.getElementById("grow-"+oFlow.flowId).addEventListener('click',function () {growCard(oFlow.flowId)});
    document.getElementById("addLoop-button-"+oFlow.flowId+"-0").addEventListener("click", function () {addLoop("0",oFlow.flowId,{},0)});  
    document.getElementById("addCond-button-"+oFlow.flowId+"-0").addEventListener("click", function () {addCondition("0",oFlow.flowId,{},{},0)});  
    document.getElementById("daily-"+oFlow.flowId).addEventListener('click',function () {updateCard(oFlow.flowId)});
    document.getElementById("title-"+oFlow.flowId).addEventListener('click',function () {updateCardTitle(oFlow.flowId)});
    document.getElementById("delete-button-card-"+oFlow.flowId).addEventListener('click',function () {deleteCard(oFlow.flowId)});

    document.getElementById("title-"+oFlow.flowId).innerText=oFlow.name;
    document.getElementById("runs-"+oFlow.flowId).innerText=oFlow.runCalls;
    document.getElementById("apis-"+oFlow.flowId).innerText=oFlow.dailyCalls;
    document.getElementById("daily-"+oFlow.flowId).value=oFlow.dailyRuns;

    const aDaysOfWeek = eNewCard.querySelectorAll("input[name='days-0']");
    aDaysOfWeek.forEach( item =>{
        item.name="days-"+oFlow.flowId;
        item.addEventListener('change',function () {updateCard(oFlow.flowId)});
        if(!oFlow.daysOfWeek.includes(item.value)){
            item.checked=false;
        }
    })
    
    aContainers.push(oContainer);
    oFlow.containers=JSON.parse(JSON.stringify(aContainers.filter(item => item.flow==oFlow.flowId)));
    aCards.push(oFlow);
    updateTable(oFlow.flowId);
}

function addLoop(sLoop,sCard,oLoop,iLevel){
    const sLoopCount=aContainers.filter(item => item.type === "loop" && item.flow==sCard).length+1;  
    if(JSON.stringify(oLoop)=="{}"){
        oLoop= {
            type:"loop",
            name:"Loop "+sLoopCount,
            typeId: sLoopCount,
            id:createGuid(),
            iterations:1,
            parent:sLoop,
            actions:1,
            totalCalls:2,
            flow:sCard,
            branch:"y",
            level:iLevel
        }
    }
    const container = document.createElement("div");
    container.style.marginLeft = "10px";
    container.style.marginRight = "2px";
    container.id="actions-div-"+sCard+"-"+oLoop.id;
    container.className="card border-black mb-3";
    container.innerHTML ="<p><span id='loopTitle-"+sCard+"-"+oLoop.id+"' contenteditable='true'>"+oLoop.name+"</span></p><p style='margin-left:"+(sLoop+1)*10+
    "px;'>Iterations:<input id='loop-"+sCard+"-"+oLoop.id+"' type='number' value='"+oLoop.iterations+"'/><Button class='btn btn-dark sm' id='addLoop-button-"+sCard+"-"+oLoop.id+
    "'><i class='fa-solid fa-retweet'></i></Button><Button class='btn btn-dark sm' id='addCon-button-"+sCard+"-"+oLoop.id+
    "'><i class='fa-solid fa-arrow-right-arrow-left'></i></Button><Button class='btn btn-dark sm' id='delete-button-"+sCard+"-"+oLoop.id+
    "'><i class='fa-solid fa-trash-can'></i></Button></p><p style='margin-left:100px;'>Child actions:<input id='action-"+sCard+"-"+oLoop.id+"' type='number' value='"+oLoop.actions+"'/></p>"

    document.getElementById("actions-div-"+sCard+"-"+sLoop).appendChild(container);
    document.getElementById("addLoop-button-"+sCard+"-"+oLoop.id).addEventListener('click',function () {addLoop(oLoop.id,sCard,{},iLevel+1)});
    document.getElementById("addCon-button-"+sCard+"-"+oLoop.id).addEventListener('click',function () {addCondition(oLoop.id,sCard,{},{},iLevel+1)});
    document.getElementById("delete-button-"+sCard+"-"+oLoop.id).addEventListener('click',function () {deleteContainer(oLoop.id,sCard)});
    document.getElementById("loop-"+sCard+"-"+oLoop.id).addEventListener('change',function () {updateLoops(oLoop.id,sCard)});
    document.getElementById("action-"+sCard+"-"+oLoop.id).addEventListener('change',function () {updateLoops(oLoop.id,sCard)});
    document.getElementById("loopTitle-"+sCard+"-"+oLoop.id).addEventListener('input', (event) => {updateTitle(oLoop.id,sCard,"loop")});
    aContainers.push(oLoop);
    updateLoops(oLoop.id,sCard,false);
}

function addCondition(sCon,sCard,oCon,oCon2,iLevel){
    const sConCount=(aContainers.filter(item => item.type === "condition" && item.flow==sCard).length/2)+1;
    if(JSON.stringify(oCon)=="{}"){
        oCon= {
            type:"condition",
            name:"Condition "+sConCount,
            typeId: sConCount,
            id:createGuid(),
            iterations:0.5,
            parent:sCon,
            actions:1,
            totalCalls:1.5,
            flow:sCard,
            branch:"y",
            level:iLevel
        }
    }
    if(JSON.stringify(oCon2)=="{}"){
        oCon2= {
            type:"condition",
            name:"Condition "+sConCount,
            typeId: sConCount,
            id:oCon.id+"-n",
            iterations:0.5,
            parent:sCon,
            actions:1,
            totalCalls:0.5,
            flow:sCard,
            branch:"n",
            level:iLevel
        }
    }
    let container = document.createElement("div");
    container.style.marginLeft = "10px";
    container.style.marginRight = "2px";
    container.id="actions-div-"+sCard+"-"+oCon.id;
    container.className="card border-black mb-3";
    container.innerHTML ="<p><span id='conTitle-"+sCard+"-"+oCon.id+"' contenteditable='true'>"+oCon.name+"</span>&nbsp;&nbsp;<span id='conCalc-"+sCard+"-"+oCon.id+"'>Yes: 0.5, No:0.5, Condition:1</span><p style='margin-left:"+(sCon+1)*10+
    "px;'>Yes %&nbsp;<input id='con-"+sCard+"-"+oCon.id+"' type='number' value='"+oCon.iterations*100+"' min='0' max='100'/><Button class='btn btn-dark sm' id='addLoop-button-"+sCard+"-"+oCon.id+
    "'><i class='fa-solid fa-retweet'></i></Button><Button class='btn btn-dark sm' id='addCon-button-"+sCard+"-"+oCon.id+
    "'><i class='fa-solid fa-arrow-right-arrow-left'></i></Button><Button class='btn btn-dark sm' id='delete-button-"+sCard+"-"+oCon.id+
    "'><i class='fa-solid fa-trash-can'></i></Button></p><p style='margin-left:10px;'>Yes child actions:&nbsp;<input id='action-"+sCard+"-"+oCon.id+"' type='number' value='"+oCon.actions+"'/></p>"

    document.getElementById("actions-div-"+sCard+"-"+sCon).appendChild(container);
    document.getElementById("addLoop-button-"+sCard+"-"+oCon.id).addEventListener('click',function () {addLoop(oCon.id,sCard,{},iLevel+1)});
    document.getElementById("addCon-button-"+sCard+"-"+oCon.id).addEventListener('click',function () {addCondition(oCon.id,sCard,{},{},iLevel+1)});
    document.getElementById("delete-button-"+sCard+"-"+oCon.id).addEventListener('click',function () {deleteCondition(oCon.id,sCard)});
    document.getElementById("con-"+sCard+"-"+oCon.id).addEventListener('change',function () {updateCondition(oCon.id,sCard,"y")});
    document.getElementById("action-"+sCard+"-"+oCon.id).addEventListener('change',function () {updateCondition(oCon.id,sCard,"y")});
    document.getElementById("conTitle-"+sCard+"-"+oCon.id).addEventListener('input', (event) => {updateTitle(oCon.id,sCard,"con")});

    container = document.createElement("div");
    container.style.marginLeft = "10px";
    container.style.marginRight = "2px";
    container.id="actions-div-"+sCard+"-"+oCon2.id;
    container.className="card border-black mb-3";
    container.innerHTML ="<p id='conTitle-"+sCard+"-"+oCon2.id+"' style='margin-left:"+(sCon*10)+
    "px;'>"+oCon.name+"</p><p style='margin-left:"+(sCon+1)*10+
    "px;'>No %&nbsp;<input id='con-"+sCard+"-"+oCon2.id+"' type='number' value='"+oCon2.iterations*100+"' min='0' max='100' style='width:90px'/><Button class='btn btn-dark sm' id='addLoop-button-"+sCard+"-"+oCon2.id+
    "'><i class='fa-solid fa-retweet'></i></Button><Button class='btn btn-dark sm' id='addCon-button-"+sCard+"-"+oCon2.id+
    "'><i class='fa-solid fa-arrow-right-arrow-left'></i></Button></p><p style='margin-left:"+(sCon+1)*10+
    "px;'>No child actions&nbsp;<input id='action-"+sCard+"-"+oCon2.id+"' type='number' value='"+oCon2.actions+"' style='width:90px'/></p>"

    document.getElementById("actions-div-"+sCard+"-"+sCon).appendChild(container);
    document.getElementById("addLoop-button-"+sCard+"-"+oCon2.id).addEventListener('click',function () {addLoop(oCon2.id,sCard,{},iLevel+1)});
    document.getElementById("addCon-button-"+sCard+"-"+oCon2.id).addEventListener('click',function () {addCondition(oCon2.id,sCard,{},{},iLevel+1)});
    document.getElementById("con-"+sCard+"-"+oCon2.id).addEventListener('change',function () {updateCondition(oCon2.id,sCard,"n")});
    document.getElementById("action-"+sCard+"-"+oCon2.id).addEventListener('change',function () {updateCondition(oCon2.id,sCard,"n")});
    aContainers.push(
        oCon,oCon2
    )  
    updateCondition(oCon.id,sCard,"y")
}

let aFilteredFlows=[];
function updateSolutionTable(sFilter){
    if(sFilter=="all"){
        sSolutionFilterId="all";
    }
    if(sFilter=="days"){
        sFilter=sSolutionFilterId;
    }
    aRunningFlows.length=0;
    aFilteredFlows.length=0;
    let sTableSolutions="<table class='table'><tr><th>Solution</th><th>Flows</th><th>Daily APIS's</th><th>Modified</th><th></th></tr>";
    let sTableFlows="<table class='table'><tr><th>Solution</th><th>Flow</th><th>Run API's</th><th>Daily APIS's</th><th>Days Of Week</th><th>Include</th></tr>";
    aSolutions.forEach(sol =>{    
        let sRow="<tr><td id='solution-"+sol.solutionId+"'>"+
        sol.solutionName+"</td><td>"+
        sol.flows.length+"</td><td>"+
        sol.dailyCalls+"</td><td>"+
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
                        bDayFound=true;
                    }
                })
                if(bDayFound){
                    let sRow="<tr><td>"+
                    flow.solution+"</td><td>"+
                    flow.name+"</td><td>"+
                    flow.runCalls+"</td><td>"+
                    flow.dailyCalls+"</td><td>"+
                    flow.daysOfWeek+"</td><td>"+
                    "<div class='form-check form-switch'><input class='form-check-input' type='checkbox' role='switch' id='flow-"+flow.flowId+"' checked><label class='form-check-label' for='flow-"+flow.flowId+"'></label></div></td></tr>";
                    if(!flow.on){sRow=sRow.replace(" checked>",">")}
                    sTableFlows+=sRow;

                }
            })
        }
    })
    document.getElementById("left-table").innerHTML=sTableSolutions+"</table>";
    document.getElementById("right-table").innerHTML=sTableFlows+"</table>";
    aSolutions.forEach(sol =>{       
        document.getElementById("filter-solution-"+sol.solutionId).addEventListener('click', function () {      
            sSolutionFilterId=sol.solutionId;     
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
                const aDays=flow.daysOfWeek.split("|");
                let bDayFound=false;
                aDays.forEach(item =>{
                    if(sDaysOfWeekFilter.includes(item)){
                        bDayFound=true;
                    }
                })
                if(bDayFound){
                    document.getElementById("flow-"+flow.flowId).addEventListener('change', function () {
                        flow.on=this.checked;  
                        updateTotals();                 
                    });             
                    aRunningFlows.push(flow)
                }
            })
        }
    })    
    updateTotals();
}

function updateTotals(){
    const aFilteredFlows=aRunningFlows.filter(item => item.on)
    let sHTML="<p>Total Daily Runs:"+aFilteredFlows.reduce((sum, item) => sum + item.dailyCalls, 0)+
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
            name:sTitle,
            daysOfWeek:sDaysOfWeek
        }
    )
    updateTable(id);
}

function updateTitle(id,sCard,type){
    const sTitle=document.getElementById(type+"Title-"+sCard+"-"+id).innerText;
    if(type=="con"){
        document.getElementById(type+"Title-"+sCard+"-"+(id+"-n")).innerText=sTitle;
    }
    const updateItem=aContainers.find(item => item.id === id && item.flow==sCard);  
    Object.assign(updateItem,
        {
            name:sTitle
        }
    )
}

function updateCondition(id,sCard,branch){
    let sIdY="";
    let sIdN="";
    let eYesPercentage;
    let eNoPercentage;

    if(branch=="y"){
        sIdN=id+"-n";
        sIdY=id;
 
    }else if(branch=="n"){
        sIdN=id;
        sIdY=id.replace("-n","");
    } 
    const iActionsY=Number(document.getElementById("action-"+sCard+"-"+sIdY).value);
    const iActionsN=Number(document.getElementById("action-"+sCard+"-"+sIdN).value);
    eYesPercentage=document.getElementById("con-"+sCard+"-"+sIdY);
    eNoPercentage=document.getElementById("con-"+sCard+"-"+sIdN);  
  
    if(branch=="y"){
        eNoPercentage.value=(100-eYesPercentage.value);
    }else{
        eYesPercentage.value=(100-eNoPercentage.value);
    }
    if(Number(eYesPercentage.value)>100 || eNoPercentage.value<0){eYesPercentage.value=100;eNoPercentage.value=0}
    if(Number(eNoPercentage.value)>100 || eYesPercentage.value<0){eNoPercentage.value=100;eYesPercentage.value=0}
    let updateItem=aContainers.find(item => item.id === sIdY && item.flow==sCard);  
    let iTotalActions=getTotalCalls(sIdY,sCard,Math.ceil((eYesPercentage.value/100)*iActionsY)+1);
    Object.assign(updateItem,
        {
            iterations:eYesPercentage.value/100,
            actions:iActionsY,
            totalCalls:iTotalActions,
        }
    )
    updateItem=aContainers.find(item => item.id ===  sIdN && item.flow==sCard); 
    iTotalActions=getTotalCalls(sIdN,sCard,Math.floor((eNoPercentage.value/100)*iActionsN)); 
    Object.assign(updateItem,
        {
            iterations:eNoPercentage.value/100,
            actions:iActionsN,
            totalCalls:iTotalActions,
        }
    )
    document.getElementById("conCalc-"+sCard+"-"+sIdY).innerText="Actions = Yes: "+iActionsY+", No:"+iActionsN+", Condition:"+(Math.ceil((eYesPercentage.value/100)*iActionsY)+Math.floor((eNoPercentage.value/100)*iActionsN));
    updateCard(sCard);
}

function updateLoops(id,sCard){
    const updateItem=aContainers.find(item => item.id === id && item.flow==sCard); 
    const iActions=Number(document.getElementById("action-"+sCard+"-"+id).value);
    const iIterations=Number(document.getElementById("loop-"+sCard+"-"+id).value);

    Object.assign(updateItem,
        {
            actions:iActions,
            iterations:iIterations,
            totalCalls:iIterations*iActions
        }
    )
    updateCard(sCard);    
}


function updateActions(id,sCard,root){
    const updateItem=aContainers.find(item => item.id === id);    
    let iActions=0;
    if(root){
        iActions=Number(document.getElementById("action-"+sCard).value)
    }else{
        iActions=Number(document.getElementById("action-"+sCard+"-"+id).value)
    }
    Object.assign(updateItem,
        {
            actions:iActions,
            totalCalls:iActions
        }
    )
    updateCard(sCard);
}

function updateCard(sCard){
    const updateItem=aCards.find(item => item.flowId === sCard);  

    const sDaysOfWeek=getSelectedDays(sCard);
    let iTotalActions=0;
    const aFlowContainers=aContainers.filter(item => item.flow==sCard && item.type!="action");
    aFlowContainers.sort((a, b) => b.level - a.level);
    console.log(aFlowContainers)
    aFlowContainers.forEach(item =>{
        let iAdd=0
        if(item.type!="action" && item.branch!="n"){iAdd=1}
        Object.assign(item,
            {
                totalCalls:(item.actions*item.iterations)+iAdd,

            }
        )
    })
    console.log(aFlowContainers)
    aFlowContainers.forEach(item =>{
       console.log(item)
        const updateItem=aFlowContainers.find(action => item.parent==action.id);
        
        if(updateItem){
            const iCombinedCalls=updateItem.totalCalls+(item.totalCalls*updateItem.iterations);
            console.log(iCombinedCalls)
            Object.assign(updateItem,
                {
                    totalCalls:iCombinedCalls

                }
            )
        }
    })
  
    const aRootContainers =aContainers.filter(item => item.flow==sCard && item.parent=="0");
    aRootContainers.forEach(item =>{
        iTotalActions+=item.totalCalls
    })

    const iDaily = Number(document.getElementById("daily-"+sCard).value);
    Object.assign(updateItem,
        {
            containers: aContainers.filter(item => item.flow==sCard),
            daysOfWeek:sDaysOfWeek,
            totalCalls:iTotalActions,
            dailyRuns:iDaily
        }
    )
    
    document.getElementById("apis-"+sCard).innerText=iTotalActions*iDaily;  
    document.getElementById("runs-"+sCard).innerText=iTotalActions;  
    updateTable(sCard);
}


function updateTable(sCard){
    const sDaysOfWeek=getSelectedDays(sCard);
    const updateItem=aCards.find(item => item.flowId === sCard);  
    if(updateItem){
        const updatedData = aContainers.filter(item =>{return item.flow==sCard});
        let iTotalActions=0;
        updatedData.forEach(item =>{
            iTotalActions+=item.actions
        })    
        Object.assign(updateItem,
            {
                dailyCalls:Number(document.getElementById("apis-"+sCard).innerText),
                runCalls:Number(document.getElementById("runs-"+sCard).innerText),
                actions:iTotalActions,
                dailyRuns:Number(document.getElementById("daily-"+sCard).value),
                solution:eSolutionTitle.innerText,
                daysOfWeek:sDaysOfWeek
            }
        )
    }
    let sHTML="<table class='table'><tr><th>Flow</th><th>Run API's</th><th>Daily API's</th><th>Actions</th><th>Daily Runs</th><th>Days</th></tr>";
    aCards.forEach(item =>{
        const sRow="<tr><td>"+
        item.name+"</td><td>"+
        item.runCalls+"</td><td>"+
        item.dailyCalls+"</td><td>"+
        item.actions+"</td><td>"+
        item.dailyRuns+"</td><td>"+
        item.daysOfWeek+"</td></tr>";
        sHTML+=sRow;
    })
    sHTML+="</table>"
    eFlowTable.innerHTML=sHTML;
    eSolutionDaily.innerText="Total Daily API: "+aCards.reduce((sum, item) => sum + item.dailyCalls, 0);    
}


function getTotalCalls(id,sCard,iTotalCalls) {
    const aContainers=aCards.find(item => item.flowId === sCard).containers; 
    const aChildren=aContainers.filter(item =>{
        return item.parent==id
    })
    aChildren.forEach(item =>{
        iTotalCalls+=item.totalCalls;
    })
    return iTotalCalls
}

function loadSolution(id){
    const oSolution=aSolutions.find(item =>{return item.solutionId==id});
    console.log(oSolution)
    sSolution=oSolution.solutionId;
    aCards.length=0;
    aContainers.length=0; 
    eleftSection.innerHTML="";   
    eSolutionTitle.innerText=oSolution.solutionName;
    oSolution.flows.forEach(card => {
        const aFlowContainers= JSON.parse(JSON.stringify(card.containers));
        aFlowContainers.forEach(item =>{
            let eActions;
            switch(item.type){
                case "loop":
                    addLoop(item.parent,card.flowId,item,item.level)
                    break;
                case "condition":
                    if(item.branch=="y"){
                        const itemN=aFlowContainers.find(con => con.id==(item.id+"-n"));
                        addCondition(item.parent,card.flowId,item,itemN,item.level)
                    }                   
                    break
                case "action":
                    addCard(card,item);
                    eActions=document.getElementById("action-"+card.flowId);
                    eActions.value=item.actions;
                    break
            }
                
        })
    })
    closeOtherCards(aCards[0].flowId);
    switchMode();
}

function deleteCard(sCard){
    document.getElementById("card-"+sCard).remove();
    aContainers = aContainers.filter(item => item.flow != sCard);
    aCards=aCards.filter(item => item.flowId !=sCard);
    document.getElementById("flow-count").innerText=aCards.length;
    updateTable(sCard);
}

function deleteCondition(id,sCard){
    deleteContainer(id,sCard);
    deleteContainer((id+"-n"),sCard);
    updateCard(sCard);
}

function deleteContainer(id,sCard){
    document.getElementById("actions-div-"+sCard+"-"+id).remove();
    getChildAndDelete(id,sCard);
    updateCard(sCard);
}

function getChildAndDelete(id,sCard){
    aContainers = aContainers.filter(item => item.id !== id);
    const aDelete=aContainers.filter(item => item.parent === id && item.flow==sCard); 
    aDelete.forEach(item =>{    
        getChildAndDelete(item.id,sCard)
    })
}

function getSelectedDays(sCard) {
    const checkboxes = document.querySelectorAll("input[name='days-"+sCard+"']:checked");
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
    const aOtherCards=aCards.filter(item => {return item.flowId!=id});
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
                flows:JSON.parse(JSON.stringify(aCards)),
                dailyCalls:aCards.reduce((sum, item) => sum + item.dailyCalls, 0),
                modified:getNow()
            }
        );
        alert(eSolutionTitle.innerText+" updated")
    }else{
        aSolutions.push({
            solutionName:eSolutionTitle.innerText,
            solutionId:sSolution,
            flows:JSON.parse(JSON.stringify(aCards)),
            dailyCalls:aCards.reduce((sum, item) => sum + item.dailyCalls, 0),
            modified:getNow()
        });
        alert(eSolutionTitle.innerText+" created")
    }
    localStorage.setItem("solutions",JSON.stringify(aSolutions));
}

function newSolution(){
    sSolution=createGuid();
    eSolutionTitle.innerText="Solution Name";
    aContainers.length=0;
    aCards.length=0;
    aContainers=[{
        type:"action",
        name:"Root Actions",
        id: "0",
        iterations:1,
        parent:"0",
        actions:1,
        totalCalls:1,
        flow:1,
        branch:"y"
    }];
    const oCards={
        flowId:"0",
        name:"Flow 1",
        dailyCalls:1,
        runCalls:1,
        actions:1,
        dailyRuns:1,
        solution:"Solution Name",
        on:true,
        containers:JSON.parse(JSON.stringify(aContainers)),
        daysOfWeek:"su|mo|tu|we|th|fr|sa"
    }
    eleftSection.innerHTML="";
    addCard(oCards,{})

}

function downloadSolution(){
    const oSolution= {
        solutionName:eSolutionTitle.innerText,
        solutionId:sSolution,
        flows:JSON.parse(JSON.stringify(aCards)),
        dailyCalls:aCards.reduce((sum, item) => sum + item.dailyCalls, 0),
        modified:getNow()
    }
    console.log(oSolution)
    const sYAML=jsyaml.dump(oSolution,{noRefs:true});
    downloadYaml(sYAML,eSolutionTitle.innerText+".yaml")
}

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



function importSolution(){
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.yaml, .yml';
    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const text = await file.text();
            const jsonObject = jsyaml.load(text);
            if (jsonObject) {
                const existingIndex = aSolutions.findIndex(item => item.solutionId == jsonObject.solutionId);
                if (existingIndex !== -1) {
                    aSolutions.splice(existingIndex, 1);
                    alert("Solution with ID "+jsonObject.solutionId+" has been replaced.");
                }
                aSolutions.push(jsonObject);         
                updateSolutionTable("all");
                localStorage.setItem("solutions",JSON.stringify(aSolutions));
            } else {
                alert('Failed to parse YAML file.');
            }
        }
    };
    input.click();
    input.remove()
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
    document.getElementById("daysPopup").style.display = "none";
    updateSolutionTable("days");
}