RUN_PARAMS = --rm --service-ports --use-aliases

.PHONY: all install run wipe migrate

all: install run

install:
	docker-compose run $(RUN_PARAMS) app yarn

run:
	docker-compose run $(RUN_PARAMS) app

wipe:
	docker-compose down app --volumes

migrate:
	docker-compose run $(RUN_PARAMS) app yarn db:push
