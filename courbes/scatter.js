// get the canvas
var ctx = document.getElementById('myChart');


var myChart = new Chart(ctx, {
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
					text: 'Chart.js Time Point Data'
				},
				scales: {
					xAxes: [{
						type: 'time',
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Date'
						},
						ticks: {
							major: {
								fontStyle: 'bold',
								fontColor: '#FF0000'
							}
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
		});