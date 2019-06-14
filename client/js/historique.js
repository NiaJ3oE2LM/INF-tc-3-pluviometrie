// get the canvas
var ctx = document.getElementById('myChart');


// configuration variable to later create the plot
var config = {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'sta-1',
            data:[{x: moment("2011-01-01"),y: 0},
                   {x: moment("2011-01-02"),y: 10},
                   {x: moment("2011-03-10"),y: 5}
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
							labelString: 'value'
						}
					}]
				}
			}
		};

// load the plot
window.onload = function() {
    var ctx = document.getElementById('myChart');
    window.myChart = new Chart(ctx, config);
};

// request to get new points from the server
function getHistorique() {
        // get data from the form section

        // resp resquest to the server


			return
		}


// update the graph tìwith the button
document.getElementById('updateData').addEventListener('click', function() {
    if (config.data.datasets.length > 0) {
        config.data.datasets[0].data = [{x: moment("2011-03-01"),y: 0},
                   {x: moment("2011-04-02"),y: 10},
                   {x: moment("2011-05-10"),y: 5}];

        window.myChart.update();
    }
});