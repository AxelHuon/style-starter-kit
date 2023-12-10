# Utiliser une image Node.js officielle comme image de base
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/style-starter-kit

# Copier les fichiers de configuration de package npm dans le répertoire de travail et installer les dépendances
COPY package*.json ./
RUN npm ci
RUN npm install -g node-fetch
RUN npm install -g style-starter-kit

# Copier le reste du code source du projet dans le répertoire de travail
COPY . .
