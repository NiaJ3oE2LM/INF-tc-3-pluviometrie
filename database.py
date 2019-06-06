"""
fonctions pour répérer les données dans le database et les utiliser
dans le serveur
"""
import sqlite3

# connection globale a la base de donnees
conn = sqlite3.connect('data/pluvio.sqlite')
c = conn.cursor()


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
    return disctionnaire du type {"nom-station":(pos_x,pos_y)}
    avec toutes stations du database
    """
    # get les noms des stations
    query = "SELECT  nom FROM 'stations'"
    c.execute(query)
    noms = [x[0] for x in c.fetchall()]
    # get la position de chaque station
    query = "SELECT  x,y FROM 'stations'"
    c.execute(query)
    poss = [(float(pos[0]), float(pos[1])) for pos in c.fetchall()]
    # build le dictionnaire
    return dict((n,pos) for n in noms for pos in poss)



def get_parametre():
    """return la valeur du parametre cherche dans le tableau stations"""
    pass


if __name__ == '__main__':
    get_stations()