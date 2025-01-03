let svgElm=document.getElementsByTagName("svg")[0];;
let iStartWidth=0;
let bToggle=true;


let bLocal=true;

const hName= document.getElementById("hidden-name");
const hTrigger=  document.getElementById("hidden-name");
const hActions=  document.getElementById("hidden-actions");
const elmZoom = document.getElementById("target-zoom");
const elmIn = document.getElementById("target-zoomIn");
const elmOut = document.getElementById("target-zoomOut");
const elmReset = document.getElementById("target-reset");
const elmKeyIcon = document.getElementById("target-keyIcon");
const elmKey = document.getElementById("target-key");
const elmDetail = document.getElementById("target-detail");
const elmDownloadPNG = document.getElementById("target-downloadPNG");
const elmDownloadSVG = document.getElementById("target-downloadSVG");
const elmModal = document.getElementById("myModal");
const elmSpan = document.getElementsByClassName("close")[0];
const downloadElem = document.getElementById("download");
let aActions=JSON.parse(hActions.innerText);

elmDownloadPNG.addEventListener("click", downloadSVGAsText);
elmDownloadSVG.addEventListener("click", downloadSVGAsText);
elmZoom.addEventListener("input", Zoom);
elmIn.addEventListener("click", ZoomIn);
elmOut.addEventListener("click", ZoomOut); 
elmReset.addEventListener("click", ZoomReset); 
elmKeyIcon.addEventListener("click", ShowKey); 
elmSpan.onclick = function() {elmModal.style.display = "none";};
document.getElementById("target-logo").addEventListener("click", toggleZoom);

window.onclick = function(event) {
  if (event.target == elmModal){elmModal.style.display = "none";}
};

function ShowKey(){
  elmDetail.style="display:none";
  elmKey.style="width:100%; display:block;";
  elmModal.style="display:block";

};

function toggleZoom(){

  if(bToggle){
    elmIn.style="position:fixed; left:150px; top:30px; font-size:20px;";
    elmOut.style="position:fixed; left:225px; top:30px; font-size:20px;";
    elmZoom.style="display:none";
    iWidth=iStartWidth;
    svgElm.setAttribute("width", iWidth+"%");
    bToggle=false;
  }else{
    elmZoom.style="";
    elmReset.style="position:fixed; left:300px; top:30px; display:none;";
    elmIn.style="position:fixed; left:150px; top:30px; font-size:20px; display:none;";
    elmOut.style="position:fixed; left:225px; top:30px; font-size:20px; display:none";
    iWidth=iStartWidth;
    svgElm.setAttribute("width", iWidth+"%");
    bToggle=true;
  }
};

function Zoom(){
  let sWidth=svgElm.getAttribute("width");
  let iWidth=parseInt(sWidth.substring(0,sWidth.length-1));
  let iZoom=parseInt(elmZoom.value);
  
  iWidth=iStartWidth+(iZoom*10);
  if(iWidth<0){iWidth=0}
    svgElm.setAttribute("width", iWidth+"%");
};

function ZoomIn(){
  let sWidth=svgElm.getAttribute("width");
  let iWidth=parseInt(sWidth.substring(0,sWidth.length-1));
  iWidth=iWidth+10;
  svgElm.setAttribute("width", iWidth+"%");
  elmReset.style="position:fixed; left:300px; top:30px;"
};

function ZoomOut(){
  let sWidth=svgElm.getAttribute("width");
  let iWidth=parseInt(sWidth.substring(0,sWidth.length-1));
  iWidth=iWidth-10;
  svgElm.setAttribute("width", iWidth+"%");
  elmReset.style="position:fixed; left:300px; top:30px;;";
};

function ZoomReset(){
  svgElm.setAttribute("width", "100%");
  elmReset.style="position:fixed; left:300px; top:30px; display:none;";
};

document.querySelector("svg").onclick = function (e) { 
  const sName=e.target.attributes["data-name"].value;
  const oTrigger=JSON.parse(hTrigger.innerText);
  const sInternals="Join/Table/ParseJson/Select/Query/Compose";
  let sModal;
  let sModal2;
  let sModal3;
  let sImagePath;

  if(bLocal){
    sImagePath="assets/img/";
  }else{
    sImagePath="https://wyattdave.github.io/Auto-Review/assets/img/";
  }

  if(sName.substring(0,1)!="*"){
    let oAction=aActions.find((item)=>item.name.replace(/[":\[|{}()\]]+/g, "")==sName);

    sModal="<b>Name:</b> "+oAction.name+"<br><b>ID:</b> "+oAction.id+"<br><b>Type:</b> "+oAction.type+"<br><b>Step: </b>"+oAction.step+"<br><b>Index:</b> "+oAction.index+"<br><b>Detail:</b> "+oAction.detail;
    sModal2="<b>Tier: </b>"+oAction.tier+"<br><b>Filter:</b> "+oAction.filter+"<br><b>Pagination:</b> "+oAction.pagination+"<br><b>Secure: </b>"+oAction.secure+"<br><b>Retry:</b> "+oAction.retry+"<br><b>Timeout: </b>"+oAction.timeout;
    sModal3="<b>Notes</b><br>"+oAction.notes;
    if(oAction.imgURL==null && (sInternals.includes(oAction.type) || oAction.type.includes("Variable"))){
      document.getElementById("target-image").src=sImagePath+"internIcon.png";
    }else  if(oAction.imgURL==null && !sInternals.includes(oAction.type)){
      document.getElementById("target-image").src=sImagePath+"autoreview icon 300 v2.png";
    }else{
      document.getElementById("target-image").src=oAction.imgURL;
    }
  }else{
    sModal="<b>Trigger: </b>"+oTrigger.trigger+"<br><b>Parameters: </b>"+oTrigger.triggerParam+"<br><b>Configs: </b>"+oTrigger.triggerConfig;
    sModal2="<br><b>Expression: </b>"+oTrigger.triggerExpress+"<br><b>Inputs: </b>"+oTrigger.triggerInputs+"<br><b>Recurrence: </b>"+oTrigger.triggerRecur;
    document.getElementById("target-image").src="assets/img/autoreview icon 300 v2.png";
  }
    
    document.getElementById("target-modal").innerHTML=sModal;
    document.getElementById("target-modal2").innerHTML=sModal2;
    if(sModal3.length>17){
      document.getElementById("target-modal3").innerHTML=sModal3;
    }else{
      document.getElementById("target-modal3").innerHTML="";
    }
    elmKey.style="display:none";
    elmDetail.style="display:block";
    elmModal.style="display:block";
  
};


function downloadSVGAsText() {
  const svg = document.querySelector("svg");
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const a = document.createElement("a");
  const e = new MouseEvent("click");
  a.download = hName.innerText+".svg";
  a.href = "data:image/svg+xml;base64," + base64doc;
  a.dispatchEvent(e);
};

function downloadSVGAsPNG(e){
  const canvas = document.createElement("canvas");
  const svg = document.querySelector("svg");
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const w = parseInt(svg.getAttribute("width"));
  const h = parseInt(svg.getAttribute("height"));
  const img_to_download = document.createElement("img");
  img_to_download.src = "data:image/svg+xml;base64," + base64doc;

  img_to_download.onload = function () {
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    const context = canvas.getContext("2d");
    context.drawImage(img_to_download,0,0,w,h);
    const dataURL = canvas.toDataURL("image/png");
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(canvas.msToBlob(), hName.innerText+".png");
      e.preventDefault();
    } else {
      const a = document.createElement("a");
      const my_evt = new MouseEvent("click");
      a.download = hName.innerText+".png";
      a.href = dataURL;
      a.dispatchEvent(my_evt);
    }
  }  
};

