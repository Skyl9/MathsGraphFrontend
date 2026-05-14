import os

# Configuration
# Ajoute ici les noms de dossiers à ignorer pour ne pas alourdir le fichier
EXCLUDE_DIRS = {
    'node_modules', 'dist', 'build', '.git', '.idea', '.vscode',
    '__pycache__', 'venv', '.venv', 'env', 'public','.junie','node_modules','public',
    '__tests__','assets',
}

# Ajoute ici les extensions de fichiers que tu veux inclure
INCLUDE_EXTENSIONS = {
    '.ts', '.tsx', '.py', '.json', '.css', '.html', '.dockerfile', '.conf', '.env',".txt"
}

# Fichiers spécifiques à ignorer (souvent trop gros ou inutiles)
EXCLUDE_FILES = {'package-lock.json', 'yarn.lock', 'poetry.lock'}

OUTPUT_FILE = 'projet_complet.txt'


def generate_snapshot():
    project_root = os.getcwd()

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(project_root):
            # Filtrer les dossiers à ignorer
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

            for file in files:
                if file in EXCLUDE_FILES:
                    continue

                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, project_root)

                # Vérifier l'extension ou le nom de fichier (ex: Dockerfile)
                extension = os.path.splitext(file)[1].lower()
                if extension in INCLUDE_EXTENSIONS or file.lower() == 'dockerfile':

                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            content = infile.read()

                        outfile.write(f"\n{'=' * 80}\n")
                        outfile.write(f" FICHIER : {relative_path}\n")
                        outfile.write(f"{'=' * 80}\n\n")
                        outfile.write(content)
                        outfile.write("\n")
                        print(f"Ajouté : {relative_path}")

                    except Exception as e:
                        print(f"Erreur lors de la lecture de {relative_path} : {e}")

    print(f"\nTerminé ! Tout ton code est dans : {OUTPUT_FILE}")


if __name__ == "__main__":
    generate_snapshot()