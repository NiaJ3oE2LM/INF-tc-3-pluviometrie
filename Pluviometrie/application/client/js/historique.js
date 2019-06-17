// récupération de canvas
var ctx = document.getElementById('myChart');


// initialisation
var config = {
    type: 'line',
    data: {
        datasets: [{
            label: 'pluie',
            data:[{x: moment("2011-01-01"),y: 0},
                   {x: moment("2018-01-02"),y: 0},
                 ]
        }]
    },
    options: {
				responsive: true,
        zoomEnabled : true,
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


// chargement initial
window.onload = function() {
    var ctx = document.getElementById('myChart');
    window.myChart = new Chart(ctx, config);
};


// encodage pour faciliter le traitement
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


// actualisation avec le bouton "affichage historique"
document.getElementById('updateData').addEventListener('click', function() {
    if (config.data.datasets.length > 0) {

        // récupération données du formulaire
        var formElement = document.getElementById("selectionAffichage");

        // appel au serveur (cf aussi map_02_modif)
        var request = new XMLHttpRequest();
        request.open("GET", "/histo"+urlencodeFormData(new FormData(formElement)), true);

        // actualisation données du graphique
        request.onload=function() {
            newDatasets = JSON.parse(this.responseText);
            refreshChart(newDatasets);
        };
        request.send()
    }
});


// refresh chart with new data from the database
var timeFormat = 'MM-DD-YYYY HH:mm';

function refreshChart(newDatasets) {

    // mise en forme des dates
    newDatasets.forEach(function(dataset,pi){

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
    window.myChart.data.datasets[0].label='pluie (mm)';
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
