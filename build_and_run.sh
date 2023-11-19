# Nom de votre image Docker
IMAGE_NAME="style-starter-kit"

# Obtenir le chemin absolu du répertoire courant
CURRENT_DIR=$(pwd)

# Affiche le chemin actuel (pour le débogage)
echo "Chemin actuel : $CURRENT_DIR"

# Construire l'image Docker
docker build -t $IMAGE_NAME .

# Exécuter l'image Docker avec le volume monté
winpty docker run -it -v $CURRENT_DIR:/usr/src/style-starter-kit $IMAGE_NAME

# Ajoutez cette ligne pour maintenir le conteneur en cours d'exécution
tail -f /dev/null
