build-static:
	# Сборка web приложения
	cd web && npm run build
	
	# Переименовываем index.html в .virtual.html
	mv ./web/dist/index.html ./web/dist/.virtual.html
	
	# Очищаем папку static и копируем туда собранные файлы
	rm -rf ./server/application/static/twa/*
	cp -r ./web/dist/* ./server/application/static/twa/
	cp ./web/dist/.virtual.html ./server/application/static/twa/.virtual.html
	cd ..
	
	@echo "✅ Статические файлы собраны и скопированы!"

encrypt:
	ansible-vault encrypt ./ansible/group_vars/all/secrets.yml

decrypt:
	ansible-vault decrypt ./ansible/group_vars/all/secrets.yml

deploy:
	ansible-playbook -i ./ansible/hosts.ini ./ansible/deploy.yml --ask-vault-pass -vvv

update-server:
	ansible-playbook -i ./ansible/hosts.ini ./ansible/update-server.yml 

update-static:	build-static
	ansible-playbook -i ./ansible/hosts.ini ./ansible/update-static.yml 

.PHONY: build-static