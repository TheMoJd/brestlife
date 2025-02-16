include .env
export $(shell sed 's/=.*//' .env)

db_up:
	docker compose -f compose-postgres.yml up -d

db_down:
	docker compose -f compose-postgres.yml down

db_restart:
	docker compose -f compose-postgres.yml restart

db_up_and_build:
	docker compose -f compose-postgres.yml up -d --build

test:
	echo ${POSTGRES_USER}

dump:
	docker compose -f compose-postgres.yml exec postgres sh -c 'pg_dump -U ${POSTGRES_USER} -d ${POSTGRES_DB} > /backups/dump.sql'

clear_db:
	docker compose -f compose-postgres.yml exec postgres sh -c 'psql -U $$POSTGRES_USER -d $$POSTGRES_DB -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"'

restore: clear_db
	docker compose -f compose-postgres.yml exec postgres sh -c 'psql -U $$POSTGRES_USER -d $$POSTGRES_DB < /backups/dump.sql'