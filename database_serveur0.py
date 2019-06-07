"""
mini-serveur qui renvoie les stations (normalement)
"""
import sqlite3
import http.server
import socketserver
from urllib.parse import urlparse, parse_qs, unquote
import json


class RequestHandler(http.server.SimpleHTTPRequestHandler):

  # sous-répertoire racine des documents statiques
  static_dir = '/client'

  #
  # On surcharge la méthode qui traite les requêtes GET
  #
  def do_GET(self):

    # On récupère les étapes du chemin d'accès
    self.init_params()
    self.send_stations()


  #
  # On surcharge la méthode qui traite les requêtes HEAD
  
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
  
  #     
  # on analyse la requête pour initialiser nos paramètres
  #
  def send_stations(self):

    g=get_stations()
    
    headers = [('Content-Type','application/json')];
    body = json.dumps(g)
    self.send(body,headers)
    
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
def get_stations():
    """
    return disctionnaire du type {"id-station":(nom_station,pos_x,pos_y)}
    avec toutes stations du database
    """
    conn = sqlite3.connect('data/pluvio.sqlite')
    c = conn.cursor()
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

"""
CREATE VIEW info_stations
AS
    SELECT nom, adresse, proprietai, datemisens, datemishor, zsol,  appartenan, identifian, gid
    FROM stations;
    """



    
    
    
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

httpd = socketserver.TCPServer(("", 8080), RequestHandler)
httpd.serve_forever()

