# Utiliser l'image officielle PostgreSQL
FROM postgres:latest

# Copier les scripts d'initialisation dans le conteneur
# Ces scripts seront exécutés automatiquement au démarrage de PostgreSQL
COPY init.sql /docker-entrypoint-initdb.d/

# Exposer le port PostgreSQL par défaut
EXPOSE 5432
