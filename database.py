"""
fonctions pour répérer les données dans le database et les utiliser
dans le serveur
"""


def send_ponctualite(self, regionID):
    """plot le taux de regularité en fonction de la region"""
    import matplotlib.pyplot as plt
    import matplotlib.ticker as ticker

    query = "SELECT  Tauxderégularité FROM 'regularite-mensuelle-ter' \
	            WHERE ID='TER_{}' ".format(regionID)
    conn = sqlite3.connect('ter.sqlite')
    c = conn.cursor()
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


def get_position()
    pass

def get_