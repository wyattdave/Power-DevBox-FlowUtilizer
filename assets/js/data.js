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
                    aDayCount[index]+=Number(flow.dailyCalls);
                    aDayCountAll[index]+=Number(flow.dailyCalls);
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
            "rgb(66, 135, 246)"
        ],
        hoverOffset: 4
        }]
    };
/*,
"rgb(216, 46, 46)",
"rgb(226, 226, 56)",
"rgb(46, 196, 56)",
"rgb(176, 56, 196)",
"rgb(236, 136, 56)",
"rgb(56, 179, 236)"
*/
    config = {
        type: "radar",
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


}

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
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256); 
    const b = Math.floor(Math.random() * 256); 
    const a = Math.random().toFixed(2); 
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

