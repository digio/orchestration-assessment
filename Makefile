build:
	docker build . -t microservices-app

build-logs:
	docker build --progress=plain . -t microservices-app

build-new:
	docker build --progress=plain . --no-cache -t microservices-app

start:
	docker-compose up --build -d

refresh:
	docker-compose down && docker build . -t microservices-app && docker-compose up --build -d

down:
	docker-compose down
