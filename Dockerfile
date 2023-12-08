# Utiliser une image Node.js officielle comme image de base
FROM node:20

# Install TypeScript
RUN npm install -g typescript

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/style-starter-kit

# Copier les fichiers de configuration de package npm dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier le reste du code source du projet dans le répertoire de travail
COPY . .


