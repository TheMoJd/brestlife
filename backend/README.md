# API REST Spring Boot Brestlife

## Installation

Générer les interfaces API et les dto depuis la spec OpenAPI :

```
mvn clean
```

```
mvn compile
```

Le code généré se trouve dans le
répertoire [target/generated-sources/openapi/src/gen/java/main/com/brestlife/generate](target/generated-sources/openapi/src/gen/java/main/com/brestlife/generate)

## Lancer l'application

1. Démarrer la base de données PostgreSQL :

```bash
cd ..
```

```bash
make db_up
```

2. Démarrer le serveur avec la
classe [BackendApplication](src/main/java/com/brestlife/backend/BackendApplication.java)

Vérifier que l'application fonctionne correctement

```bash
curl http://localhost:8080/api/health
```

Le résultat attendu de la requête est le message `OK`
