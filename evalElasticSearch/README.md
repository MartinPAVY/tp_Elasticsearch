# TP Elasticsearch: Recherche dans le dataset "Spotify Tracks"

Votre mission dans ce TP est de construire un ensemble de composants frontend permettant d'explorer et interroger un dataset de 114000 morceaux presents sur Spotify. La recherche est un élément clé de toute application, en particulier pour les applications de musique comme Spotify. Ses clients s’attendent à une expérience de recherche fluide et précise pour trouver les morceaux qu’ils aiment. Elasticsearch est un outil puissant qui peut aider à fournir cette expérience.

## Prérequis

Système
- Environ 3.6 Go d'espace libre pour les éléments du TP
- Environ 2.7 Go d'espace libre pour les outils utilisés (pas nécessaire si vous les avez déjà installés)

Outils
- [Visual Studio Code](https://code.visualstudio.com/download) ou un éditeur ou IDE de votre choix
- [Docker](https://docs.docker.com/engine/install/) pour installer et faire tourner Elasticsearch
- [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) pour installer et gérer des versions multiples de Node.js
- [Node.js](https://nodejs.org/en/download) version 18.16.1 pour l'application frontend

Optionel
- [Google Chrome](https://www.google.com/chrome/) si vous souhaitez utiliser les tests automatiques pour la vérification de votre travail

## Installation et mise en place du TP

Commencez par l'installation de votre éditeur, Docker, puis nvm. **Attention**, le script d'installation fourni par eux sur GitHub ne fonctionne que sur un environnement Linux, lisez attentivement leurs instructions d'installation. Au cas où vous travaillez sur Windows, installez plutôt [nvm-windows](https://github.com/coreybutler/nvm-windows)

Une fois ces outils-là installés, ouvrez une invite de commande dans le répertoire de ce projet, puis exécutez les commandes suivantes

```
nvm use                 # Permet d'installer et utiliser la bonne version de Node.js
npm install             # Installe les dépendances du projet
docker compose pull     # Télécharge les images Docker pour Elasticsearch et Kibana
docker compose up -d    # Lance Elasticsearch et Kibana
```

Attendez 1 à 2 minutes, puis naviguez vers l'adresse http://localhost:5601 pour ouvrir Kibana. Ouvrez le menu sur la gauche et naviguez vers `Management > Dev Tools` puis sur l'onglet `Console`. Dans cette console, tapez `GET /` puis appuyez sur le bouton Play ou utilisez le raccourci `Ctrl + Enter` pour lancer la requête. Si vous recevez une réponse réussie décrivant le cluster Elasticsearch, vous pouvez passer à la suite de l'installation

Ensuite, nous allons importer les données Spotify qui se situent dans le répertoire `data` dans un indexe Elasticsearch appelé `songs`. Pour cela, un script d'importation vous est mis à disposition dans le répertoire `bin` du projet. Pour le lancer, exécutez la commande

```
node ./bin/import-spotify-data.js     # Met en forme et importent les données Spotify
```

Si l'importation réussit, le message "Imported" apparaîtra dans l'invite de commande. En cas d'erreur, assurez-vous d'avoir bien suivi les étapes précédentes. Si vous voulez recommencer, intéressez-vous à la partie **Nettoyage en fin de TP** de ce document.

Enfin, nous allons lancer notre frontend grace à la commande

```
npm start
```

Pour l'ouvrir, naviguez vers l'adresse http://localhost:4200/

## Votre mission

Votre mission consiste à analyser les fichiers `src/app/services/basic-search.service.ts`, `src/app/services/intermediate-search.service.ts`, `src/app/services/advanced-search.service.ts`, et `src/app/services/stats.service.ts`. Ces classes contiennent des commentaires décrivant ce que leurs méthodes incomplètes doivent accomplir. Vous pouvez aussi retrouver ces fichiers et leurs consignes en cherchant le mot "TODO" dans l'ensemble des fichiers du projet. Dans ces quatre fichiers, vous devrez modifier uniquement la variable `request` afin de lui fournir l'endpoint, le verbe, et le corps d'une requête HTTP adressée à Elasticsearch. Si vos modifications sont correctes, l'application fera automatiquement le travail de traiter et afficher les résultats.

Les services de recherche (search) permettent de faire fonctionner les filtres présents sur l'interface. Vous pouvez changer le service utilisé en le modifiant le menu déroulant "Filtres à utiliser" à droite de la barre de recherche. Quant au service stats, il sert à obtenir quelques informations sur l'ensemble de nos données

N'hésitez pas à expérimenter en utilisant la console de Kibana vue lors de l'installation des outils. Elle est située à http://localhost:5601/app/dev_tools#/console

## Tester son travail (Optionnel)

Des fichiers de tests permettant de vérifier votre travail sont mis à votre disposition mais nécessitent une variable d'environnement contenant le chemin de l'exécutable du navigateur Google Chrome ou Chromium. Le chemin vers cet exécutable change selon votre ordinateur. Une fois que vous l'avez identifié, vous pouvez exécuter une de ces commandes selon votre système d'exploitation

```
export CHROME_BIN=/usr/bin/chromium-browser                                       # Sur Linux & Mac
SET CHROME_BIN="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"      # Sur Windows cmd.exe
$Env:CHROME_BIN = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'   # Sur Windows PowerShell
```

Puis la commande `npm test` pour executer les tests.

## Nettoyage en fin de TP

Afin de supprimer toutes les données Docker liées à ce TP, exécutez les commandes suivantes

```
docker compose down                     # Arrête et supprime les conteneurs Docker pour Elasticsearch et Kibana
docker compose down -v                  # Supprime les volumes Docker contenant les données Spotify
docker image rm elasticsearch:8.10.2    # Supprime l'image Docker d'Elasticsearch
docker image rm kibana:8.10.2           # Supprime l'image Docker de Kibana
```

## Notices & Droits d'Auteur

Ce TP utilise le dataset [Spotify Tracks Dataset](https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset) publié sur [Kaggle](https://www.kaggle.com/) par [MaharshiPandya](https://www.kaggle.com/maharshipandya)

Exercises et support conçus par [Marius USVAT](https://www.linkedin.com/in/marius-usvat/) pour l'[EPSI](https://epsi.fr/), parcours DWWM en ligne

Copyright DWWM EPSI ONLINE
