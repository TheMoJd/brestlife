# --------------------------------------------
# Makefile for managing the database container
# --------------------------------------------

include .env
export $(shell sed 's/=.*//' .env)

# Create the container and start the database
db_up:
	docker compose -f compose-postgres.yml up -d

# Stop the container
db_down:
	docker compose -f compose-postgres.yml down

# Restart the container
db_restart:
	docker compose -f compose-postgres.yml restart

# Rebuild the container and start the database
db_up_and_build:
	docker compose -f compose-postgres.yml up -d --build

# Remove the content of the database
db_clean:
	docker compose -f compose-postgres.yml exec postgres sh -c 'psql -U $$POSTGRES_USER -d $$POSTGRES_DB -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"'

# Backup the database to a file backups/dump.sql
dump:
	docker compose -f compose-postgres.yml exec postgres sh -c 'pg_dump -U ${POSTGRES_USER} -d ${POSTGRES_DB} > /backups/dump.sql'

# Restore the database from the file backups/dump.sql
restore: db_clean
	docker compose -f compose-postgres.yml exec postgres sh -c 'psql -U $$POSTGRES_USER -d $$POSTGRES_DB < /backups/dump.sql'