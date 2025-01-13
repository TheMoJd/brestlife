db_up:
	docker compose -f compose-postgres.yml up -d

db_down:
	docker compose -f compose-postgres.yml down

db_restart:
	docker compose -f compose-postgres.yml restart