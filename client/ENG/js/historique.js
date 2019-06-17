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
                        autoSkip: true, // ajustement axe x
						scaleLabel: {
							display: true,
							labelString: 'Date'
						}
					}],
					yAxes: [{
					    type: 'linear',
						display: true,
						autoSkip: true, // ajustement axe y
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


// rafraichir le graphique avec de nouvelles données de la base de données
var timeFormat = 'MM-DD-YYYY HH:mm';

function refreshChart(newDatasets) {

    // mise en forme des dates
    newDatasets.forEach(function(dataset,pi){

        // ajoute des couleurs

        rgb = randomRGB();
        dataset.backgroundColor = 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+', 0.4)';
        dataset.borderColor = 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+', 1)';
        dataset.fill = true;

        dataset.lineTension = 0;


        // mise à jour des dates avec moment.js
        dataset.data.forEach(function(point, pi){
            dataset.data[pi].x = moment(point.x, timeFormat).format();
        });
    });

    // mise à jour des données du graphe
    config.data.datasets = newDatasets;
    console.log(config.data.datasets)

    // mise à jour de la fenetre du graphe
    window.myChart.update();
};



// couleur random
function randomRGB(){

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    r = getRandomInt(255);
    g = getRandomInt(255);
    b = getRandomInt(255);

    return [r,g,b]
}
