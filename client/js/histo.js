(function($){
  var xhr = new XMLHttpRequest();
  xhr.open('GET','/histo',true);
  xhr.send();
  xhr.onload = function() {   // fonction callback
    // récupération des données renvoyées par le serveur
  var data = JSON.parse(this.responseText);
    // boucle sur les enregistrements renvoyés
    for ( i = 0; i < data.length; i++ ) {
      }
  };
})(jQuery);
