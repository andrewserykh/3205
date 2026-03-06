DOCKER_DIR = docker
TARGET_DIR = docker/uql/uql

.PHONY: build clean sync

build: clean sync
	cd docker && docker-compose -f docker-compose.build.yml build

clean:
	rm -rf docker/uql/uql

sync:
	rsync -Rr \
		--include='src/***' \
		--include='prisma/***' \
		--include='docker-entrypoint.sh' \
		--include='package.json' \
		--include='package-lock.json' \
		--include='tsconfig.json' \
		--exclude='*' \
		. $(TARGET_DIR)

up:
	cd $(DOCKER_DIR) && docker-compose up -d

down:
	cd $(DOCKER_DIR) && docker-compose down

logs:
	cd $(DOCKER_DIR) && docker-compose logs -f uql
	
test:
	bash -c 'source ~/.nvm/nvm.sh && nvm use $(NODE_VERSION) && npm test'

test-watch:
	bash -c 'source ~/.nvm/nvm.sh && nvm use $(NODE_VERSION) && npm run test:watch'

test-coverage:
	bash -c 'source ~/.nvm/nvm.sh && nvm use $(NODE_VERSION) && npm run test -- --coverage'