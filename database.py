"""
fonctions pour répérer les données dans le database et les utiliser
dans le serveur
"""
import sqlite3

# connection globale a la base de donnees
conn = sqlite3.connect('data/pluvio.sqlite')
c = conn.cursor()


""" creation d'une vue pour
CREATE VIEW info_stations
AS
    SELECT nom, adresse, proprietai, datemisens, datemishor, zsol,  appartenan, identifian, gid
    FROM stations;
"""

""" decoupage date et valeur non vides
select substr(`date`,1,2), substr(`date`,4,2), substr(`date`,7,4), substr(`date`,12),`sta-1` from historique where `sta-1` != '' 
"""

""" exemple recherche
select date, `sta-1` from historique where substr(`date`,7,4)='2012' and `sta-1`!=''
"""


def get_stations():
    """
    return disctionnaire du type {"id-station":(nom_station,pos_x,pos_y)}
    avec toutes stations du database
    """
    # get la nom position et ids de chaque station
    query = "SELECT  nom,x,y,identifian FROM `stations`"
    c.execute(query)
    poss = [{'nom':format_stationName(pos[0]),
             'lat':float(pos[1]),
             'lon':float(pos[2]),
             'id':int(pos[3])
    }for pos in c.fetchall()]
    # build le dictionnaire
    return poss


def get_allinfo_station(id_station):
    """
    return un dictionnaire du type {"info_cle":"info_value"}
    pour un id_station donné. info_cle suit la nomenclature du sujet
    """
    query = "SELECT * FROM info_stations  WHERE identifian = '{}'".format(int(id_station))
    c.execute(query)
    info = [x for x in c.fetchone()]
    keys = ['nom','adresse', 'proprietai', 'datemisens', 'datemishor', 'zsol',  'appartenan', 'identifian', 'gid']
    return dict((keys[i],info[i]) for i in range(8))


def get_historique(id_station, an_debut, an_fin):
    """
    rende l'historique d'un station la choisissant par son identifiant
    l'historique est limitee par la date de debut et la date de fin
    anne - mois - jour
    :return: liste des valeus de l'historique
    """
    query = "select `date`, `sta-{0}` from `historique` "\
        "where `sta-{0}`!='' "\
        "and substr(`date`,7,4)>='{1}'"\
        "and substr(`date`,7,4)<='{2}'".format(id_station, an_debut, an_fin)
    c.execute(query)
    return c.fetchall()


def format_stationName(name):
    """
    string in lower case all but first letter
    :param name:
    :return:
    """
    words = []
    for w in name.split():
        if len(w) <= 2:
            words.append(w.lower())
        elif len(w) > 2:
            words.append(w[0].upper() + w[1:].lower())
        else:
            words.append(w)
    return " ".join(words)

if __name__ == '__main__':
    print(get_historique(1,2012,2013))
    #print(get_stations())
    # print(format_stationName("CHAMPAGNE AU MONT D OR"))