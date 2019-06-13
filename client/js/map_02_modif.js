    /* ==============================================
    MAP -->
    =============================================== */
    var locations=[]
    function load_data () {
      alert('load')
      var xhr = new XMLHttpRequest();
      xhr.open('GET','/pluvio',true);
      xhr.send();
      xhr.onload = function() {   // fonction callback
        // récupération des données renvoyées par le serveur
  	  var data = JSON.parse(this.responseText);
        // boucle sur les enregistrements renvoyés
        for ( id = 0; id < data.length; id++ ) {
          // liste des positions à marquer [nom,long,lat]
          locations.push(['<div class="infobox"><h3 class="title"><a href="#">'+String(data[id].nom)+'</a></h3><span>blabla</span><span>blabla2</span>',data[id].lat,data[id].lon])
  	    }//locations=[[nom,lat,long],[],...]
      };
      var infowindow=new google.maps.InfoWindow();
      var lat;
      var long;
      var text;
      var marker,
      i;
      for (var i=0;
      i < locations.length;
      i++) {
        alert('construction')
        text=locations[i][0];
        lat=locations[i][1];
        long=locations[i][2];
          marker=new google.maps.Marker( {
              position: new google.maps.LatLng(lat,long), map: map, icon: 'images/apple-touch-icon.png'
          }
          );
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
              return function() {
                  infowindow.setContent(text);
                  infowindow.open(map, marker);


              }
          }

          )(marker, i));
      }
     }
    //   //construction de la carte
       (function($) {
        "use strict";
        alert('map')
        var map=new google.maps.Map(document.getElementById('map'), {
            zoom: 12, scrollwheel: false, navigationControl: true, mapTypeControl: false, scaleControl: false, draggable: true, styles: [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#3ac5c8"
            },
            {
                "visibility": "on"
            }
        ]
    }
], center: new google.maps.LatLng(45+45/60,4+50/60), mapTypeId: google.maps.MapTypeId.ROADMAP //on centre sur Lyon
        }

        );
        load_data();
      })(jQuery);
