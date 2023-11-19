# Nom de votre image Docker
IMAGE_NAME="style-starter-kit"

# Obtenir le chemin absolu du répertoire courant
CURRENT_DIR=$(pwd)

# Construire l'image Docker
docker build -t $IMAGE_NAME .

# Exécuter l'image Docker avec le volume monté
docker run -it -v $CURRENT_DIR:/usr/src/style-starter-kit $IMAGE_NAME
