// get the canvas
var ctx = document.getElementById('myChart');


// configuration variable to later create the plot
var config = {
    type: 'line',
    data: {
        datasets: [{
            label: 'sta-1',
            data:[{x: moment("2011-01-01"),y: 0},
                   {x: moment("2018-01-02"),y: 0},
                 ]
        }]
    },
    options: {
				responsive: true,
				title: {
					display: true,
					text: 'Historique pluviométrie'
				},
				scales: {
					xAxes: [{
                        type: 'time',
                        autoSkip: true, // autoscale x axis
						scaleLabel: {
							display: true,
							labelString: 'Date'
						}
					}],
					yAxes: [{
					    type: 'linear',
						display: true,
						autoSkip: true, // autoscale y axis
						scaleLabel: {
							display: true,
							labelString: 'Hauteur de pluie mesurée en mm'
						},
						ticks:{
						    beginAtZero: true
						}
					}]
				}
			}
		};


// load the plot the first time
window.onload = function() {
    var ctx = document.getElementById('myChart');
    window.myChart = new Chart(ctx, config);
};


// encode formData object for easier backend processing
function urlencodeFormData(fd){
    var s = '';
    function encode(s){ return encodeURIComponent(s).replace(/%20/g,'+'); }
    for(var pair of fd.entries()){
        if(typeof pair[1]=='string'){
            s += (s?'&':'') + encode(pair[0])+'='+encode(pair[1]);
        }
    }
    return "?"+s;
};


// update the graph with the "affichage historique" button
document.getElementById('updateData').addEventListener('click', function() {
    if (config.data.datasets.length > 0) {

        // get data from the formsection
        var formElement = document.getElementById("selectionAffichage");

        // resp resquest to the server --> pareille que dans carte
        var request = new XMLHttpRequest();
        request.open("GET", "/histo"+urlencodeFormData(new FormData(formElement)), true);

        // update data on the graph config wuth the answer
        request.onload=function() {
            newDatasets = JSON.parse(this.response);
            refreshChart(newDatasets);
        };
        request.send()
    }
});


// refresh chart with new data from the database
var timeFormat = 'MM-DD-YYYY HH:mm';

function refreshChart(newDatasets) {

    // mise en forme des dates
    newDatasets.forEach(function(dataset,di){

        // ajoute des couleurs
        rgb = randomRGB();
        dataset.backgroundColor = 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+', 0.4)';
        dataset.borderColor = 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+', 1)';
        dataset.fill = true;
        // straight line
        dataset.lineTension = 0;


        // update date with moment.js
        dataset.data.forEach(function(point, pi){
            dataset.data[pi].x = moment(point.x, timeFormat).format();
        });
    });

    // update chart datasets config
    config.data.datasets = newDatasets;
    console.log(config.data.datasets)

    // update chart window with the new config
    window.myChart.update();
};


// random color function
function randomRGB(){
    // random int function from MDN
    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    r = getRandomInt(255);
    g = getRandomInt(255);
    b = getRandomInt(255);

    return [r,g,b]
}