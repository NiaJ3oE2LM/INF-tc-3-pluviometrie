import http.server
import socketserver

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    # sous-répertoire racine des documents statiques  
    static_dir = '/client'# on surcharge la méthode qui traite les requêtes GET  
    def do_GET(self):# on modifie le chemin d'accès en insérant un répertoire préfixe
        self.path = self.static_dir + self.path# on traite la requête via la classe parent
        http.server.SimpleHTTPRequestHandler.do_GET(self)

httpd = socketserver.TCPServer(("", 8080),RequestHandler)# on démarre le serveur, qui se lance dans une boucle infinie# en l'attente de requêtes provenant de clients éventuels...
httpd.serve_forever()