#!/bin/bash

# Остановить выполнение при любой ошибке
set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Корневая папка проекта (папка где лежит скрипт)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/docker"
TARGET_DIR="$DOCKER_DIR/uql/uql"

echo -e "${YELLOW}🔧 Building UQL Docker image...${NC}"

# 1. Очистить старую папку
echo -e "${YELLOW}→ Cleaning old build...${NC}"
rm -rf "$TARGET_DIR"

# 2. Синхронизировать файлы
echo -e "${YELLOW}→ Syncing files...${NC}"
rsync -Rr \
  --include='src/***' \
  --include='package.json' \
  --include='package-lock.json' \
  --include='tsconfig.json' \
  --exclude='*' \
  . "$DOCKER_DIR/uql/uql"

# 3. Билд Docker образа
echo -e "${YELLOW}→ Building Docker image...${NC}"
cd "$DOCKER_DIR"
docker-compose -f docker-compose.build.yml build

echo -e "${GREEN}✅ Done!${NC}"