import http.server
import socketserver
from urllib.parse import urlparse, parse_qs, unquote
import json
import sqlite3

"""import local modules"""
from database import get_stations, get_allinfo_station

""" structure lien historique 
http://localhost:8001/?id_3=on&id_13=on&id_17=on&id_18=on&datebegin=2017-04-05&Pastps=12&dateend=2018-01-17
"""

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    # sous-répertoire racine des documents statiques  
    static_dir = '/client'# on surcharge la méthode qui traite les requêtes GET

    def do_GET(self):
        """
        on modifie le chemin d'accès en insérant un répertoire préfixe
        """

        self.init_params() # lecture des requetes

        # selection entre carte et historique
        if self.path_info[0]=='pluvio':
            self.send_stations()
        if self.path_info[0] == 'histo':
            self.sed_historique(self.params)
        else :
            self.send_static()
        #http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_HEAD(self):
        self.send_static()


    def send_static(self):
        """
         On envoie le document statique demandé
        """
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


    def send_stations(self):
        poss=[]
        for d1 in get_stations():
            d2 = get_allinfo_station(d1['id'])
            keys = list(d1.keys()) + list(d2.keys())
            values = list(d1.values()) + list(d2.values())
            listkv = [(keys[i],values[i]) for i in range(len(keys))]
            d= {key:value for (key,value) in listkv}
            poss.append(d)
        # build le dictionnaire
        s=json.dumps(poss)
        headers=[('Content-type','application/json')]
        self.send(s,headers)


    def send_historique(self, formdata):
        pass

httpd = socketserver.TCPServer(("", 8001),RequestHandler)# on démarre le serveur, qui se lance dans une boucle infinie# en l'attente de requêtes provenant de clients éventuels...
httpd.serve_forever()