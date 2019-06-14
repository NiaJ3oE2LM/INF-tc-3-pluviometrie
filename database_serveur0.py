import http.server
import socketserver
from urllib.parse import urlparse, parse_qs, unquote
import json
import sqlite3

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    # sous-répertoire racine des documents statiques  
    static_dir = '/client'# on surcharge la méthode qui traite les requêtes GET

    def do_GET(self):
        """
        on modifie le chemin d'accès en insérant un répertoire préfixe
        """
        self.init_params()
        if self.path_info[0]=='pluvio':
            self.get_stations()
        else :
            self.send_static()
        #http.server.SimpleHTTPRequestHandler.do_GET(self)
    def do_HEAD(self):
        self.send_static()

  #
  # On envoie le document statique demandé
  #

    def send_static(self):
    
        # on modifie le chemin d'accès en insérant un répertoire préfixe
        self.path = self.static_dir + self.path
    
        # on appelle la méthode parent (do_GET ou do_HEAD)
        # à partir du verbe HTTP (GET ou HEAD)
        if (self.command=='HEAD'):
            http.server.SimpleHTTPRequestHandler.do_HEAD(self)
        else:
            http.server.SimpleHTTPRequestHandler.do_GET(self)


    def send(self,body,headers=[]):

        # on encode la chaine de caractères à envoyer
        encoded = bytes(body, 'UTF-8')
    
        # on envoie la ligne de statut
        self.send_response(200)
    
        # on envoie les lignes d'entête et la ligne vide
        [self.send_header(*t) for t in headers]
        self.send_header('Content-Length',int(len(encoded)))
        self.end_headers()
    
        # on envoie le corps de la réponse
        self.wfile.write(encoded)


    def init_params(self):
        # analyse de l'adresse
        info = urlparse(self.path)
        self.path_info = [unquote(v) for v in info.path.split('/')[1:]]  # info.path.split('/')[1:]
        self.query_string = info.query
        self.params = parse_qs(info.query)
    
        # récupération du corps
        length = self.headers.get('Content-Length')
        ctype = self.headers.get('Content-Type')
        if length:
          self.body = str(self.rfile.read(int(length)),'utf-8')
          if ctype == 'application/x-www-form-urlencoded' : 
            self.params = parse_qs(self.body)
        else:
          self.body = ''
       
        # traces
        print('info_path =',self.path_info)
        print('body =',length,ctype,self.body)
        print('params =', self.params)




    def get_stations(self):
        conn = sqlite3.connect('data/pluvio.sqlite')
        c = conn.cursor()
        """
        return disctionnaire du type {"id-station":(nom_station,pos_x,pos_y)}
        avec toutes stations du database
        """
        # get la nom position et ids de chaque station
        query = "SELECT  nom,x,y,identifian FROM `stations`"
        c.execute(query)
        poss=[]
        for pos in c.fetchall():
            d1={'nom':format_stationName(pos[0]),
                     'lat':float(pos[2]),
                     'lon':float(pos[1]),
                     'id':int(pos[3])
            }
            d2=get_allinfo_station(d1['id'])
            keys=list(d1.keys())+list(d2.keys())
            values=list(d1.values())+list(d2.values())
            listkv=[(keys[i],values[i]) for i in range(len(keys))]
            d={key:value for (key,value) in listkv}
            poss.append(d)
        # build le dictionnaire
        s=json.dumps(poss)
        headers=[('Content-type','application/json')]
        self.send(s,headers)


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

    

httpd = socketserver.TCPServer(("", 8080),RequestHandler)# on démarre le serveur, qui se lance dans une boucle infinie# en l'attente de requêtes provenant de clients éventuels...
httpd.serve_forever()