// function limite_mois(mois)  {
// 	tab_mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
// 	tab_mois = tab_mois[1:mois]
// 	return tab_mois
// }



var MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
var DAYS = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29',
   		'30','31'];

// var xhr = new XMLHttpRequest();
// var id = document.getElementById('id_station'),
// 	tmin = document.getElementById('datebegin').value,
// 	tmax = document.getElementById('dateend').value;

// xhr.onload() = function() {
// 	var data = JSON.parse(this.responseText)
// 	donnes = data.get_historique(id,tmin,tmax)
// }
// xhr 

var donees = [(('2012','06','02'),(0.2,'7:44')),(('2012','06','02'),(0.2,'7:44')),(('2012','06','02'),(0.2,'7:44')),(('2012','06','02'),(0.2,'7:44'))];
var pluv = [0.2,0.1,0.1,0.2,0.0,0.1,0.2];
 
		var config = {
			type: 'line',
			data: {
				labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
				datasets: [{
					label: 'test',
					backgroundColor: window.chartColors.red,
					borderColor: window.chartColors.red,
					data: [1,1,1,1,1,1,1],  // on récupère les données
					fill: false,
				},{
					label: 'Pluviométrie',
					backgroundColor: window.chartColors.blue,
					borderColor: window.chartColors.blue,
					data: pluv,  // on récupère les données
						fill: false,
				},
				]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Evolution de la pluviométrie dans le Grand Lyon'
				},
				tooltips: {
					mode: 'index',
					intersect: true,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Date'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Hauteur d\'	eau en mm'
						}
					}]
				}
			}
		};

		window.onload = function() {
			var ctx = document.getElementById('canvas').getContext('2d');
			window.myLine = new Chart(ctx, config);
		};

		document.getElementById('randomizeData').addEventListener('click', function() {
			config.data.datasets.forEach(function(dataset) {
				dataset.data = dataset.data.map(function() {
					return randomScalingFactor();
				});

			});

			window.myLine.update();
		});

		var colorNames = Object.keys(window.chartColors);
		document.getElementById('addDataset').addEventListener('click', function() {
			var colorName = colorNames[config.data.datasets.length % colorNames.length];
			var newColor = window.chartColors[colorName];
			var newDataset = {
				label: 'Dataset ' + config.data.datasets.length,
				backgroundColor: newColor,
				borderColor: newColor,
				data: [],
				fill: false
			};

			for (var index = 0; index < config.data.labels.length; ++index) {
				newDataset.data.push(randomScalingFactor());
			}

			config.data.datasets.push(newDataset);
			window.myLine.update();
		});


		document.getElementById('removeDataset').addEventListener('click', function() {
			config.data.datasets.splice(0, 1);
			window.myLine.update();
		});
