/*By David wyatt, https://www.linkedin.com/in/wyattdave/ , under license: https://github.com/wyattdave/my-power-platform/blob/main/LICENSE*/
let timeLineChart;
let daysMixChart;
let solutionChart;
let flowsChart;

let connectionChart;
let flowChart;
const aDaysOfWeekList=["su","mo","tu","we","th","fr","sa"];
let aDayCountAll=[0,0,0,0,0,0,0];

function enforceCanvasHeight(chartId) {
    const canvas = document.getElementById(chartId);
    if (canvas) {
        canvas.style.height = '40vh';
    }
}


function loadCharts(bRefresh){

    let aAllFlows=[];

    /// flows by day by solution
    let aLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let aSolutionFlowCount=[];
    let aSolutionColour=[];

    let aData=[];
    aSolutions.forEach(item => {
        aAllFlows=aAllFlows.concat(item.flows);
        const sColour=getRandomRGBA();
        aSolutionFlowCount.push(item.flows.length);
        aSolutionColour.push(sColour);
        let aDayCount=[0,0,0,0,0,0,0];
        item.flows.forEach(flow => {
            aDaysOfWeekList.forEach((day, index) => {
                if(flow.daysOfWeek.includes(day)){
                    aDayCount[index]+=flow.dailyCalls;
                    aDayCountAll[index]+=flow.dailyCalls;
                }
            })
        })
        aData.push({
            label:item.solutionName,
            fill: false,
            pointRadius: 1,
            borderColor: sColour,
            data: aDayCount,
            pointRadius: 3, 
            pointHoverRadius: 5,
            pointBackgroundColor: sColour,
            pointBorderColor: sColour
        })
    })

    let data = {
        labels: aLabels, 
        datasets: aData
    };

    let config = {
        type: "line",
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true, 
                    position: "top" 
                },
                title: {
                    display: true,
                    text: 'Calls By Solution By Day'
                }
                
            },
            layout: {
                padding: {
                    right: 40
                }
            },
            scales: {
                y: {
                    beginAtZero: true, 
                    title: {
                        display: true,
                        text: "Totals" 
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Day"
                    }
                }
            }
        }
    };
  
    if(bRefresh){
        addData(timeLineChart, aLabels, data.datasets)
    }else{
        timeLineChart= new Chart(document.getElementById("timelineChart").getContext("2d"), config);  
    }
    enforceCanvasHeight("timelineChart");

////day mix
    data = {
        labels: aLabels,
        datasets: [{
        label: "Total Daily Calls",
        data: aDayCountAll,
        backgroundColor: [
            "rgb(66, 135, 246)",
            "rgb(216, 46, 46)",
            "rgb(226, 226, 56)",
            "rgb(46, 196, 56)",
            "rgb(176, 56, 196)",
            "rgb(236, 136, 56)",
            "rgb(56, 179, 236)"
        ],
        hoverOffset: 4
        }]
    };

    config = {
        type: "doughnut",
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false,
                    position: "top"
                },
                tooltip: {
                    enabled: true
                },
                title: {
                    display: true,
                    text: 'Calls By Day'
                }
            }
        }
    };
    if(bRefresh){
        addData(daysMixChart, aLabels, data.datasets)
    }else{
        daysMixChart= new Chart(document.getElementById("daysMixChart").getContext("2d"), config);
    }
    enforceCanvasHeight("daysMixChart");

    //// top 10 flow runcalls
    aAllFlows.sort((a, b) => b.runCalls - a.runCalls);
    aTopFlows=aAllFlows.slice(0, 10);
    aLabels =aTopFlows.flatMap(obj => obj.name);

    data = {
        labels: aLabels,
        datasets: [{
        label: "Daily Calls",
        data: aTopFlows.flatMap(obj => obj.runCalls),
        backgroundColor: [
            "rgb(66, 135, 246)",
            "rgb(216, 46, 46)",
            "rgb(226, 226, 56)",
            "rgb(46, 196, 56)",
            "rgb(176, 56, 196)",
            "rgb(236, 136, 56)",
            "rgb(56, 179, 236)",
            "rgb(236, 56, 182)",
            "rgb(141, 168, 179)",
            "rgb(65, 0, 245)"
        ],
        hoverOffset: 4
        }]
    };

    config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "x",
            responsive:true,
            barThickness:10,
            barPercentage: 0.8,
            scales: {
                y: {
                    ticks: {
                        autoSkip: false, 
                        maxRotation: 0,  
                        minRotation: 0  
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                    position: "top"
                },
                tooltip: {
                    enabled: true
                },
                title: {
                    display: true,
                    text: 'Top 10 Flows by Run Calls'
                }
            }

        }
    };
    if(bRefresh){
        addData(flowChart, aLabels, data.datasets);
    }else{
        flowChart= new Chart(document.getElementById("flowChart").getContext("2d"), config);
    }
    enforceCanvasHeight("flowChart");
////flow by solution
data = {
    labels: aSolutions.flatMap(obj => obj.solutionName),
    datasets: [{
    label: "Flows Count",
    data: aSolutionFlowCount,
    backgroundColor: aSolutionColour,
    hoverOffset: 4
    }]
};

config = {
    type: "pie",
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
                position: "top"
            },
            tooltip: {
                enabled: true
            },
            title: {
                display: true,
                text: 'Flows By Solution'
            }
        }
    }
};
if(bRefresh){
    addData(flowsChart, aSolutions.flatMap(obj => obj.solutionName), data.datasets)
}else{
    flowsChart= new Chart(document.getElementById("flowsChart").getContext("2d"), config);
}
enforceCanvasHeight("flowsChart");

/*
    ////connection references
    aEnvironmentSolutions=aEnvironments.sort((a, b) => {
        return b.components - a.components;
    });

    const aLabelsCon =["SharePoint","Dataverse","Outlook 365","Forms","Users 365","Teams","Power BI","Excel Business","OneDrive Business","Approvals","Others"]

    data = {
        labels: aLabelsCon,
        datasets: [{
        label: "Connection References",
        data: [
            aData.filter(item =>{return item.type=="connection reference" && item.connector=="shared_sharepointonline"}).length,
            aData.filter(item =>{return item.type=="connection reference" && item.connector=="shared_commondataserviceforapps"}).length,
            aData.filter(item =>{return item.type=="connection reference" && item.connector=="shared_office365"}).length,
            aData.filter(item =>{return item.type=="connection reference" && item.connector=="shared_microsoftforms"}).length,
            aData.filter(item =>{return item.type=="connection reference" && item.connector=="shared_office365users"}).length,
            aData.filter(item =>{return item.type=="connection reference" && item.connector=="shared_teams"}).length,
            aData.filter(item =>{return item.type=="connection reference" && item.connector=="shared_powerbi"}).length,
            aData.filter(item =>{return item.type=="connection reference" && item.connector=="shared_excelonlinebusiness"}).length,
            aData.filter(item =>{return item.type=="connection reference" && item.connector=="shared_onedriveforbusiness"}).length,            
            aData.filter(item =>{return item.type=="connection reference" && item.connector=="shared_approvals"}).length,
            aData.filter(item =>{return item.type=="connection reference"}).splice(0,10).length.length

        ],
        backgroundColor: [
            "rgb(0, 110, 74)",//sp
            "rgb(51, 153, 51)",//dv
            "rgb(1, 115, 199)",//out
            "rgb(62, 169, 92)",//form
            "rgb(242, 80, 34)",//user
            "rgb(70, 47, 146)",//teams
            "rgb(255, 190, 0)",//pbi
            "rgb(16, 124, 16)",//exc
            "rgb(0, 114, 198)",//one
            "rgb(100, 100, 246)",//app
            "rgb(115, 115, 115)"//other
        ],
        hoverOffset: 4
        }]
    };

    config = {
        type: "pie",
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false
        }
    };
    if(bRefresh){
        addData(connectionChart, aLabelsCon, data.datasets)
    }else{
        connectionChart= new Chart(document.getElementById("connectionChart").getContext("2d"), config);
    }

   ///components
   

    ////solution
    aEnvironmentSolutions=aEnvironments.sort((a, b) => {
        return b.components - a.components;
    });
    const aLastSolutions=structuredClone(aEnvironmentSolutions);
    
    let aLabelsSol=[]; 
    let aSolutionData=[]; 
    for(i=0;i<4;i++){
        if(aEnvironmentSolutions[i]){
            aLabelsSol.push(aEnvironmentSolutions[i].displayName);
            aSolutionData.push(aEnvironmentSolutions[i].solutions);
        }   
    }
    if(aEnvironmentSolutions.length>3){
        aLabelsSol.push("All Others");
        aSolutionData.push(aLastSolutions.splice(0,4).length);
    }
   
    data = {
        labels: aLabelsSol,
        datasets: [{
          label: "Solutions",
          data: aSolutionData,
          backgroundColor: [
            "rgb(66, 135, 246)",
            "rgb(216, 46, 46)",
            "rgb(226, 226, 56)",
            "rgb(46, 196, 56)",
            "rgb(176, 56, 196)"
          ],
          hoverOffset: 4
        }]
    };

    config = {
        type: "doughnut",
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    };
    if(bRefresh){
        addData(solutionChart, aLabelsSol, data.datasets)
    }else{
        solutionChart= new Chart(document.getElementById("solutionChart").getContext("2d"), config);   
    }

    blurbage(aData,aEnvironments)
*/
}
/*
function blurbage(aData,aEnvironments){
    let sHtml="";
    let aSolutions=[];
   
    aSolutions=aData.filter(item =>{return item.type=="solution"}).sort((a, b) => {
        return b.contents.flows - a.contents.flows;
    });
    let sSolutionFlows={displayName:"N/A",count:0};
    if(aSolutions.length>0){sSolutionFlows={displayName:aSolutions[0].displayName,count:aSolutions[0].contents.flows}}

    aSolutions=aData.filter(item =>{return item.type=="solution"}).sort((a, b) => {
        return b.contents.apps - a.contents.apps;
    });
    const aSolutionApps=aSolutions.filter(item =>{return item.type=="app"})
    let sSolutionApps={displayName:"N/A",count:0};
    if(aSolutions.length>0){sSolutionApps={displayName:aSolutions[0].displayName,count:aSolutions[0].contents.apps}}
 
    aSolutions=aData.filter(item =>{return item.type=="solution"}).sort((a, b) => {
        return b.contents.vars - a.contents.vars;
    });
    const aSolutionVariables=aSolutions.filter(item =>{return item.type=="environment reference"})
    let sSolutionVariables={displayName:"N/A",count:0};
    if(aSolutions.length>0){sSolutionVariables={displayName:aSolutions[0].displayName,count:aSolutions[0].contents.vars}}

    aSolutions=aData.filter(item =>{return item.type=="solution"}).sort((a, b) => {
        return b.contents.components - a.contents.components;
    });
    const aTriggers=aData.filter(item =>{return item.type=="flow"}).map(item => item.trigger);

    let aTriggerTotals=[];
    aTriggers.forEach(trig =>{
        aTriggerTotals.push({
            name:trig,
            count:aData.filter(item =>{return item.type=="flow" && item.trigger==trig})
        })
    })

    const sTopTrigger=aTriggerTotals.sort((a, b) => {
        return b.count - a.count;
    })[0].name;

    if(aData.filter(item =>{return item.type=="flow"}).length>(aData.filter(item =>{return item.type=="app"}).length*2)&&
    aData.filter(item =>{return item.type=="flow"}).length>(aData.filter(item =>{return item.type=="agent"}).length*4))
    {
        sHtml+="<img src='assets/img/flow.svg' style='height:20px;padding-right:10px'/>&nbsp;You are Flow Rider<br>"
    }else if(Data.filter(item =>{return item.type=="app"}).length>(aData.filter(item =>{return item.type=="agent"}).length*2)){
        sHtml+="<img src='assets/img/app.svg' style='height:20px;padding-right:10px'/>&nbsp;You are Canvas Campbell<br>"
    }else{
        sHtml+="<img src='assets/img/agent.svg' style='height:20px;padding-right:10px'/>&nbsp;You are Agent Smith<br>"
    }    
    sHtml+="Geo: <b>"+sCurrentGeo+"</b><br>";
    sHtml+="<b>"+aEnvironments.length+"</b> Environments, <b>"+aEnvironments.filter(env =>{return env.components>0}).length+"</b> used<br>";
    sHtml+="<b>"+iNonGeo+"</b> Environments from other geos not shown<br>"
    sHtml+="<br><b>Totals</b><br>Flows: <b>"+aData.filter(item =>{return item.type=="flow"}).length+"</b>, top trigger is <b>"+sTopTrigger+"</b><br>";
    sHtml+="Apps: <b>"+aData.filter(item =>{return item.type=="app"}).length+"</b><br>";
    sHtml+="Agents: <b>"+aData.filter(item =>{return item.type=="agent"}).length+"</b><br>";
    sHtml+="Connection Refs: <b>"+aData.filter(item =>{return item.type=="connection reference"}).length+"</b><br>";
    sHtml+="Env Variables: <b>"+aData.filter(item =>{return item.type=="environment variable"}).length+"</b><br>";
    sHtml+="<br><b>Solutions</b><br><b>"+aSolutions.length+"</b> total solutions<br>";
    sHtml+="Solution with most components is <b>"+aSolutions[0].displayName+"</b> with <b>"+aSolutions[0].contents.components+"</b> components. Average size is <b>"+Math.floor(aSolutions.reduce((a, b) => a + b.contents.components, 0) / aSolutions.length)+"</b><br>";
    sHtml+="With the most flows is <b>"+sSolutionFlows.displayName+"</b> with <b>"+sSolutionFlows.count+"</b><br>";
    eData.innerHTML=sHtml;
}

function groupArray(array) {
    const result = [0,0,0,0,0,0,0,0,0,0,0,0];
    array.forEach(item =>{
        result[item-1]+=1
    })
    return result;
}

function destroyCharts(){
    timeLineChart.destroy();
    solutionChart.destroy();
    variableChart.destroy();
    connectionChart.destroy();
    componentChart.destroy();

    timeLineChart=null;
}

*/
function addData(chart, aLabel, aNewData) {
    chart.data.labels.length=0;
    chart.data.datasets.length=0;
    chart.data.labels=aLabel;
    aNewData.forEach((item) => {
        chart.data.datasets.push(item);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    console.log( chart.data.labels)
    chart.update();

}

function getRandomRGBA() {
    const r = Math.floor(Math.random() * 256); // Random value between 0 and 255
    const g = Math.floor(Math.random() * 256); // Random value between 0 and 255
    const b = Math.floor(Math.random() * 256); // Random value between 0 and 255
    const a = Math.random().toFixed(2); // Random value between 0 and 1 with 2 decimal places
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

