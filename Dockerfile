# Utiliser une image Node.js officielle comme image de base
FROM node:20


#Install typescript
RUN npm install -g typescript

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/style-starter-kit

# Copier les fichiers de configuration de package npm dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier le reste du code source du projet dans le répertoire de travail
COPY . .

# Installer votre CLI globalement
RUN npm install -g .

# La commande par défaut peut être un shell, pour une interaction manuelle avec le CLI
CMD [ "/bin/bash" ]
