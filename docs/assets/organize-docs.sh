#!/usr/bin/env bash
#
# organize-docs.sh
#
# Move o README.md e os assets baixados (banner.png, architecture.svg, flow.svg)
# para os lugares corretos dentro do repo do desafio.
#
# COMO USAR:
#   1. Baixe os arquivos (README.md, banner.png, architecture.svg, flow.svg)
#      pro seu computador — normalmente caem em ~/Downloads.
#   2. Copie este script pra RAIZ do repositório (frontend-challenge/).
#   3. Rode: bash organize-docs.sh
#      (ou, se os arquivos baixados estiverem em outra pasta:
#       bash organize-docs.sh /caminho/para/a/pasta/de/downloads)
#
# O QUE ELE FAZ:
#   - Cria docs/assets/ se não existir.
#   - Move architecture.svg, flow.svg e banner.png para docs/assets/.
#   - Move o README.md pra raiz do projeto, fazendo backup do antigo
#     (README.old.md) se já existir um.
#   - Não sobrescreve nada sem avisar.

set -euo pipefail

SOURCE_DIR="${1:-$HOME/Downloads}"
PROJECT_ROOT="$(pwd)"
ASSETS_DIR="$PROJECT_ROOT/docs/assets"

echo "→ Pasta de origem dos downloads: $SOURCE_DIR"
echo "→ Raiz do projeto (pasta atual): $PROJECT_ROOT"
echo ""

mkdir -p "$ASSETS_DIR"

move_file() {
  local filename="$1"
  local destination="$2"

  if [ -f "$SOURCE_DIR/$filename" ]; then
    mv "$SOURCE_DIR/$filename" "$destination"
    echo "✓ $filename → $destination"
  else
    echo "⚠ $filename não encontrado em $SOURCE_DIR — pulei esse arquivo."
  fi
}

# README (com backup do antigo, se existir)
if [ -f "$SOURCE_DIR/README.md" ]; then
  if [ -f "$PROJECT_ROOT/README.md" ]; then
    mv "$PROJECT_ROOT/README.md" "$PROJECT_ROOT/README.old.md"
    echo "↺ README.md antigo salvo como README.old.md"
  fi
  mv "$SOURCE_DIR/README.md" "$PROJECT_ROOT/README.md"
  echo "✓ README.md → $PROJECT_ROOT/README.md"
else
  echo "⚠ README.md não encontrado em $SOURCE_DIR — pulei esse arquivo."
fi

# Assets
move_file "architecture.svg" "$ASSETS_DIR/architecture.svg"
move_file "flow.svg" "$ASSETS_DIR/flow.svg"
move_file "banner.png" "$ASSETS_DIR/banner.png"

echo ""
echo "Concluído. Revise com: git status"
