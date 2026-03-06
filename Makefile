.PHONY: up down build logs

up:
	cd uql && make up
	cd vue_uql && make up

down:
	cd uql && make down
	cd vue_uql && make down

build:
	cd uql && make build
	cd vue_uql && make build

logs:
	cd uql && make logs &
	cd vue_uql && make logs
