let iElementAutoHeight=0

const eRuns=document.getElementById("runs-0");
const eAddLoop=document.getElementById("addLoop-button");
let aLoops=[{
    type:"action",
    id: 0,
    iterations:1,
    parent:0,
    actions:1
}];
let iLoopCount=0

eAddLoop.addEventListener("click", function () {addLoop(0)});
document.getElementById("action-0").addEventListener('change',function () {updateActions(0)});
document.getElementById("shrink-0").addEventListener('click',function () {shrinkCard(0)});
document.getElementById("grow-0").addEventListener('click',function () {growCard(0)});


function addLoop(iLoop,padding){
    iLoopCount++;
    const loopContainer = document.createElement("div");
    loopContainer.style.marginLeft = "10px";
    loopContainer.style.marginRight = "2px";
    loopContainer.id="actions-div-"+iLoopCount;
    loopContainer.className="card border-black mb-3";
    loopContainer.innerHTML = 
        "<p style='margin-left:"+(iLoop*10)+
        "px;'>Loop "+iLoopCount+"<p style='margin-left:"+(iLoop+1)*10+
        "px;'>Iterations:<input id='loop-"+iLoopCount+"' type='number'/><Button id='addLoop-"+iLoopCount+
        "'>+</Button></p><p style='margin-left:"+(iLoop+1)*10+
        "px;'>Child actions:<input id='action-"+iLoopCount+"' type='number'/></p>";
    document.getElementById("actions-div-"+iLoop).appendChild(loopContainer);

    let i=iLoopCount;
    document.getElementById("addLoop-"+iLoopCount).addEventListener('click',function () {addLoop(i)});
    document.getElementById("loop-"+iLoopCount).addEventListener('change',function () {updateIterations(i)});
    document.getElementById("action-"+iLoopCount).addEventListener('change',function () {updateActions(i)});
    aLoops.push(
        {
            type:"loop",
            id: iLoopCount,
            iterations:1,
            parent:iLoop,
            actions:0,
            totalIterations:1
        }
    )
}

function updateActions(id){

    const updateItem=aLoops.find(item => item.id === id);
    
    Object.assign(updateItem,
        {
            type:updateItem.type,
            id: id,
            iterations:updateItem.iterations,
            parent:updateItem.parent,
            actions:Number(document.getElementById("action-"+iLoopCount).value),
            totalIterations:updateItem.iterations
        }
    )
    console.log(aLoops)
    totalAPIs()
}

function updateIterations(id){
    const updateItem=aLoops.find(item => item.id === id);
    
    Object.assign(updateItem,
        {
            type:updateItem.type,
            id: id,
            iterations:Number(document.getElementById("loop-"+iLoopCount).value),
            parent:updateItem.parent,
            actions:updateItem.actions,
            totalIterations:Number(document.getElementById("loop-"+iLoopCount).value)
        }
    )
    console.log(aLoops)
}

function totalAPIs(){
    const updatedData = updateTotalIterations(aLoops);
    let iTotalAPIS=0;
    updatedData.forEach(item =>{
        iTotalAPIS+=(item.totalIterations*item.actions)
    })
    
    eRuns.innerText=iTotalAPIS; 
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