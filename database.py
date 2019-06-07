"""
fonctions pour répérer les données dans le database et les utiliser
dans le serveur
"""
import sqlite3

# connection globale a la base de donnees
conn = sqlite3.connect('data/pluvio.sqlite')
c = conn.cursor()

# creation d'une vue pour
"""
CREATE VIEW info_stations
AS
    SELECT nom, adresse, proprietai, datemisens, datemishor, zsol,  appartenan, identifian, gid
    FROM stations;
"""


def send_ponctualite(self, regionID):
    """encore à completer"""
    import matplotlib.pyplot as plt
    import matplotlib.ticker as ticker

    query = "SELECT  Tauxderégularité FROM 'regularite-mensuelle-ter' \
	            WHERE ID='TER_{}' ".format(regionID)

    c.execute(query)
    r_all = c.fetchall()
    r = []
    if r_all:
        [r.append(float(x[0])) for x in r_all]
    # create the figure
    fig, ax = plt.subplots()
    fig.suptitle('TER_{}'.format(regionID))
    ax.set_xlabel("mois")
    ax.xaxis.set_major_locator(ticker.MultipleLocator(10))
    # ax.xaxis.set_minor_locator(ticker.MultipleLocator(1))
    ax.set_ylabel('Taux de régularité')
    ax.plot(r, '*-')
    plot_name = 'courbes/ter_{}.svg'.format(regionID)
    # save the fig
    self.path = self.static_dir + plot_name
    fig.savefig(self.path)
    # get the region name
    query = "SELECT DISTINCT Région FROM 'regularite-mensuelle-ter'\
                  where ID = 'TER_{}' ".format(regionID)
    c.execute(query)
    regionName = c.fetchone()[0]
    # send the plot path on the server
    self.send_json({
        'title': "regularite {} (TER-{})".format(regionName, regionID),
        'img': plot_name
    })


def get_stations():
    """
    return disctionnaire du type {"id-station":(nom_station,pos_x,pos_y)}
    avec toutes stations du database
    """
    # get les noms des stations
    query = "SELECT identifian FROM 'stations'"
    c.execute(query)
    ids = [x[0] for x in c.fetchall()]
    # get la position de chaque station
    query = "SELECT  nom,x,y FROM 'stations'"
    c.execute(query)
    poss = [(pos[0],float(pos[1]), float(pos[2])) for pos in c.fetchall()]
    # build le dictionnaire
    return dict((id,pos) for id in ids for pos in poss)



def get_allinfo_station(station):
    """
    return un dictionnaire du type {"info_cle":"info_value"}
    pour une station donnée. info_cle suit la nomenclature du sujet
    """
    query = "SELECT * FROM info_stations  WHERE nom = '{}'".format(str(station))
    c.execute(query)
    info = [x for x in c.fetchone()]
    # remove le nom
    info.pop(0)
    # create le dictionnaire
    keys = ['adresse', 'proprietai', 'datemisens', 'datemishor', 'zsol',  'appartenan', 'identifian', 'gid']
    return dict((keys[i],info[i]) for i in range(8))


if __name__ == '__main__':
    print(get_stations())
    #print(get_allinfo_station('LIMONEST'))
