dev:
	docker compose up

db: 
	npm run db
	cp ./application/schemas/database.sql ./database/database.sql
	
reset:
	docker compose down --volumes --remove-orphans
	docker rm -f $(shell docker ps -aq) 2>/dev/null || true
	docker rmi -f $(shell docker images -aq) 2>/dev/null || true
	sudo rm -rf ./data || true
	sudo rm -rf ./application/static/* || true
	cd ..
	@echo "✅ Все контейнеры, образы и данные удалены!"

.PHONY: reset dev db