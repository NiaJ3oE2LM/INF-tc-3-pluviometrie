// get the canvas
var ctx = document.getElementById('myChart');


// configuration variable to later create the plot
var config = {
    type: 'line',
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


// encode formdata
function urlencodeFormData(fd){
    var s = '';
    function encode(s){ return encodeURIComponent(s).replace(/%20/g,'+'); }
    for(var pair of fd.entries()){
        if(typeof pair[1]=='string'){
            s += (s?'&':'') + encode(pair[0])+'='+encode(pair[1]);
        }
    }
    return "?"+s;
}


// update the graph tìwith the button
document.getElementById('updateData').addEventListener('click', function() {
    if (config.data.datasets.length > 0) {

        // get data from the formsection
        var formElement = document.getElementById("selectionAffichage");

        // resp resquest to the server --> pareille que dans carte
        var request = new XMLHttpRequest();
        request.open("GET", "/histo"+urlencodeFormData(new FormData(formElement)), true);

        // update data on the graph config wuth the answer
        request.onload=function() {
            // TODO more than one ....
            arr = JSON.parse(this.response).id_1;
            arr.forEach(function(item, index){
                arr[index].x = moment(item.x).format();
            });

            config.data.datasets[0].data = arr;
            //console.log(config.data.datasets[0].data)

            // update thew graph with the new config
            window.myChart.update();
        };
        request.send()
    }
});