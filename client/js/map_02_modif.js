    /* ==============================================
    MAP -->
    =============================================== */

    (function($) {
      var locations=[];
      var xhr = new XMLHttpRequest();
      var d='r';
      xhr.open('GET','/pluvio',true);
      xhr.send();
      xhr.onload = function() {   // fonction callback
        // récupération des données renvoyées par le serveur
  	  var data = JSON.parse(this.responseText);
        // boucle sur les enregistrements renvoyés
        for ( i = 0; i < data.length; i++ ) {
          d=data[i];
          // liste des positions à marquer [nom,long,lat]'nom','adresse', 'proprietai', 'datemisens', 'datemishor', 'zsol',  'appartenan', 'identifian', 'gid'
          locations.push([faitexte(d.nom,d.adresse,d.proprietai,d.datemisens,d.datemishor, d.zsol,  d.appartenan, d.identifian, d.gid),data[i].lat,data[i].lon])
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

    function faittexte(nom,adresse,proprietai,datemisens,datemishor, zsol,  appartenan, identifian, gid){
      alert('text')
      return('<div class="infobox"><h3 class="title">'+nom+'</h3><h2 class="title">Identifiant : '+identifian+'</h2><li class="dropdown yamm-fw hasmenu"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Features <span class="fa fa-angle-down"></span></a><ul class="dropdown-menu"><li><div class="yamm-content"><div class="col-md-4"><ul><li>Adresse : '+adresse+'</li><li>Propri&eacute;taire : '+proprietai+'</li><li>Mise en service : '+datemiseens+'</li><li>Fermeture : '+datemishor+'</li><li>Appartenant à : '+appartenan+'</li><li>Gid : '+gid+'</li></ul></div></div></li></ul></li>')
    }
