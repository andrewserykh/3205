NAME = vue_uql
DOCKER_DIR = docker
TARGET_DIR = $(DOCKER_DIR)/$(NAME)/$(NAME)

.PHONY: build clean sync nginx docker

build: clean sync nginx docker

clean:
	rm -rf $(TARGET_DIR)
	rm -rf $(DOCKER_DIR)/*.gz

sync:
	@echo "Copying build files for $(NAME)"
	rsync -Rr \
		--include='src/***' \
		--include='public/***' \
		--include='package.json' \
		--include='package-lock.json' \
		--include='vite.config.js' \
		--include='vite.config.ts' \
		--include='tsconfig.json' \
		--include='tsconfig.app.json' \
		--include='index.html' \
		--include='.nvmrc' \
		--exclude='*' \
		. $(TARGET_DIR)
	
	
	

nginx:
	@echo "Copying nginx files for $(NAME)"
	rsync -a \
		--include='nginx/***' \
		--exclude='nginx/public/*' \
		nginx $(TARGET_DIR)

docker:
	cd $(DOCKER_DIR) && docker-compose -f docker-compose.build.yml build

up:
	cd $(DOCKER_DIR) && docker-compose up -d

down:
	cd $(DOCKER_DIR) && docker-compose down

logs:
	cd $(DOCKER_DIR) && docker-compose logs -f $(NAME)