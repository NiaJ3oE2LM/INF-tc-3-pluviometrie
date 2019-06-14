    /* ==============================================
    MAP -->
    =============================================== */

    (function($) {
      var locations=[];
      var xhr = new XMLHttpRequest();
      var nom='r';
      var info='r';
      xhr.open('GET','/pluvio',true);
      xhr.send();
      xhr.onload = function() {   // fonction callback
        // récupération des données renvoyées par le serveur
  	  var data = JSON.parse(this.responseText);
        // boucle sur les enregistrements renvoyés
        for ( i = 0; i < data.length; i++ ) {
          nom=data[i].nom;
          info='<div class="infobox"><h3 class="title"><a href="#">'+nom+'</a></h3><span><h2 class="title">Identifiant</h2><div>'+String(data[i].id)'</div></span><span>blabla2</span>';
          // liste des positions à marquer [nom,long,lat]
          locations.push([info,data[i].lat,data[i].lon)
  	    }//locations=[[nom,lat,long],[],...]
      };
      setTimeout(function(){map(locations);},1000);
    })(jQuery);
    //   //construction de la carte
    function map(locations) {
        "use strict";
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
        var infowindow=new google.maps.InfoWindow();
        var lat;
        var long;
        var text;
        var marker,
        i;
        for ( i=0;
        i < locations.length;
        i++) {
          lat=locations[i][1];
          long=locations[i][2];
            marker=new google.maps.Marker( {
                position: new google.maps.LatLng(lat,long), map: map, icon: 'images/apple-touch-icon.png'
            }
            );
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(locations[i][0]);
                    infowindow.open(map, marker);
                }
            }

            )(marker, i));
        }
    };
