    /* ==============================================
    MAP -->
    =============================================== */
    function load_data () {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {   // fonction callback
          // récupération des données renvoyées par le serveur
        var data = JSON.parse(this.responseText);
          // boucle sur les enregistrements renvoyés
          for ( n = 0; n < data.length; n++ ) {
            // insertion d'un marqueur à la position, attachement d'une popup, capture de l'évènement "clic'
          L.marker([data[n].lat,data[n].lon]).addTo(map)
              .bindPopup(data[n].nom)
          .addEventListener('click',OnMarkerClick)
          .idreg=data[n].nom;   // propriété personnalisée ajouté au marqueur
          }
        };
        xhr.open('GET','/regions',true);
        xhr.send();
    }
    (function($) {
        "use strict";
        var locations=[ ['<div class="infobox"><h3 class="title"><a href="#">Lyon 1</a></h3><span>blabla</span><span>blabla2</span></div>',
        45+45/60+35/3600,
        4+50/60+32/3600,
        0],['<div class="infobox"><h3 class="title"><a href="#">Lyon 2</a></h3><span>fre</span><span>zer</span></div>',
        45+45/60+36/3600,
        4+50/60+33/3600,
        0]];
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
], center: new google.maps.LatLng(45+45/60,4+50/60), mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        );
        var infowindow=new google.maps.InfoWindow();
        var marker,
        i;
        for (i=0;
        i < locations.length;
        i++) {
            marker=new google.maps.Marker( {
                position: new google.maps.LatLng(locations[i][1], locations[i][2]), map: map, icon: 'images/apple-touch-icon.png'
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
    })(jQuery);
