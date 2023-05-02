// DOM elements
const scatterInput = document.querySelector('#scatterInput');
const bellInput = document.querySelector('#bellInput');
const bellStatsSelect = document.querySelector('#bellStat');
const bellStatLi = document.querySelector('#bellStatLi');
const bellStatButton = document.querySelector('#bellStat');
const progressBar = document.querySelector('#status');
const resetButton = document.querySelector('#reset');

progressBar.style.visibility='hidden';
bellStatButton.setAttribute('disabled', true);

// Workers
const scatterWorker = new Worker('scatterWorker.js');
const bellWorker = new Worker('bellWorker.js');
const bellStatsWorker = new Worker('bellStatsWorker.js');

// Chart for stats
let chart;

// adding event handlers
resetButton.addEventListener('click', (e)=>{
    document.querySelector('#bellCurvePlot').replaceChildren();
    document.querySelector('#scatterPlot').replaceChildren();
})

scatterInput.addEventListener('blur', (e)=>{
    const useThread = document.querySelector('#thread:checked');
    const progressBar = document.querySelector('#status');
    progressBar.style.visibility='visible';
    if(useThread.value=='worker'){
        // sending message to the worker
        scatterWorker.postMessage(e.target.value);
    }else{
        const data = generateXY(Number(e.target.value));
        drawScatterPlot(data, 'Scatter Plot generated in main thread')
    }
})


bellInput.addEventListener('blur', (e)=>{
    const useThread = document.querySelector('#thread:checked');
    const progressBar = document.querySelector('#status');
    progressBar.style.visibility='visible';
    if(useThread.value=='worker'){
        // sending message to the worker
        bellWorker.postMessage(e.target.value);
    }else{
        const data = generateX(Number(e.target.value));
        drawBellCurve(data, 'Bell Curve using Main thread');
    }
})

bellStatsSelect.addEventListener('click', (e)=>{
    const data = chart.series[2].data.map(e=>e['y']);
    bellStatsWorker.postMessage(data);
})

// Recieving Messages from the worker
scatterWorker.onmessage = (event) => {  
    const data = event.data;
    drawScatterPlot(data, 'Scatter Plot using Worker thread')
};

// Recieving Messages from the worker
bellWorker.onmessage = (event) => {
    const data = event.data;
    drawBellCurve(data, 'Bell Curve using Main thread');
    document.querySelector('#bellStat').removeAttribute("disabled");
};

// Recieving Messages from the worker
bellStatsWorker.onmessage = (event) =>{
    const data = event.data;
    const mean = data[0];
    const std = data[1];
    
    bellStatLi.replaceChildren();
    const meanli = document.createElement('li')
    meanli.append(`Mean: ${mean}`);
    const stdli = document.createElement('li')
    stdli.append(`Std: ${std}`);
    bellStatLi.append(meanli);
    bellStatLi.append(stdli);
}

// Utility functions to test point generation in 
// Main Thread
function isSame(p1, p2){
    return p1[0]==p2[0] && p1[1]==p2[1];
}

function generateXY(num) {
    let points = [];
    let i = 0;
    while(i<num){
        const x = Math.floor(Math.random() * num/3);
        const y = Math.floor(Math.random() * num/3);
        if(points.findIndex(e=>isSame(e,[x,y]))==-1){
            points.push([x,y])
            i++;
        }
    }
    return points;
}
  
function generateX(num) {
    let points = [];
    let i = 0;
    while(i<num){
        const x = Math.floor(Math.random() * num/10);
        if(points.filter(e=>e==x).length<=10){
            points.push(x)
            i++;
        }
    }
    return points;
}
  
// for plotting
function drawScatterPlot(data, title=''){
    Highcharts.chart('scatterPlot',{
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: title,
        },
        xAxis: {
            title: {
                text: 'Y'
            },
        },
        yAxis: {
            title: {
                text: 'Y'
            },
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 1.5,
                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                jitter: {
                    x: 0.005
                }
            }
        },
        tooltip: {
            pointFormat: 'X: {point.x}<br/> Y: {point.y}'
        },
        series:[ 
            {
            name: '',
            type: 'scatter',
            data: data,
        }]
    });
    const progressBar = document.querySelector('#status');
    progressBar.style.visibility='hidden';
}

function drawBellCurve(data, title=''){
    var pointsInInterval = 5;
    chart = Highcharts.chart('bellCurvePlot',{
        chart: {
            margin: [50, 0, 50, 50],
            events: {
                load: function () {
                    Highcharts.each(this.series[0].data, function (point, i) {
                        var labels = ['3σ', '2σ', 'σ', 'μ', 'σ', '2σ', '3σ'];
                        if (i % pointsInInterval === 0) {
                            point.update({
                                color: 'blue',
                                dataLabels: {
                                    enabled: true,
                                    format: labels[Math.floor(i / pointsInInterval)],
                                    overflow: 'none',
                                    crop: false,
                                    y: -2,
                                    style: {
                                        fontSize: '13px'
                                    }
                                }
                            });
                        }
                    });
                }
            }
        },
        title: {
            text: title
        },
        xAxis: [{
            title: {
                text: 'Data'
            },
            alignTicks: true
            }, 
            {
            alignTicks: true,
        }],
        yAxis: [{
            title: {
                text: 'Data'
            }
            }, {
            title: {
                text: 'Bell curve'
            },
            opposite: true
            }, {
            title: {
                text: 'Histogram'
            },
            opposite: true
        }],
        plotOptions: {
            histogram: {
                color:'blue',
                binsNumber: 14
            },
        },

        series: [{
            name:'Distribution',
            type: 'bellcurve',
            xAxis: 1,
            yAxis: 1,
            intervals: 3,
            baseSeries: 's1',
            pointsInInterval:5,
            marker:{
                enabled:true,
                color:'blue'
            },
            color:'blue',
            opacity:0.5,
            zIndex: -1,
            tooltip:{
                headerFormat:'',
                pointFormat: 'X: {point.x}</b>'
            },
        }, 
        {
            name: 'Frequency',
            type: 'histogram',
            xAxis: 1,
            yAxis: 2,
            baseSeries: 's1',
            accessibility: {
                exposeAsGroupOnly: true
            },
            marker: {
                radius: 1.5
            },
            tooltip:{
                pointFormat: 'X: {point.x:.2f}-{point.x2:.2f} <br>Number of Points:{point.y}</b>'
            },
        }, 
        {
            name: '',
            type: 'scatter',
            data: data,
            id: 's1',
            marker: {
                radius: 1.5
            },
                visible: false
        }]
        })
        const progressBar = document.querySelector('#status');
    progressBar.style.visibility='hidden';
};

function getMean(arr) {
    let s = 0;
    let n = arr.length;

    for(const v of arr){
        s += Number(v);
    }
    return s/n;
}

function getStd(arr, mean){
    let s=0;
    let n=arr.length;
    for(const v of arr){
        s += Math.pow(+v - mean, 2);
    }
    return s/n;
}
  
