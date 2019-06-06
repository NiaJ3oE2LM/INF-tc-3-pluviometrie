+ position des stations
+ historique: date debut - fin 
+ choix de plusieurs stations
+ 


# creation d'un vue 
DROP VIEW  info_stations;
CREATE VIEW info_stations
AS
    SELECT nom,proprietai, datemisens, datemishor, zsol, appartenan, identifian, gid
    FROM stations