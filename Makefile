# Copyright 2023 Mantel Group Pty Ltd
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#    http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

### Microservices App ###

build:
	docker compose build

start:
	docker compose up -d

start-logs:
	docker compose up

build-start:
	docker-compose up --build -d

refresh:
	docker-compose down && docker-compose up --build -d

down:
	docker-compose down

### Conductor ###

c-build:
	docker compose -f ./docker-compose-conductor.yml build

c-start:
	docker compose -f docker-compose-conductor.yml up -d

c-start-logs:
	docker compose -f docker-compose-conductor.yml up

c-refresh:
	docker compose -f docker-compose-conductor.yml down && docker compose -f ./docker-compose-conductor.yml build && docker compose -f docker-compose-conductor.yml up -d

c-down:
	docker compose -f docker-compose-conductor.yml down

### Temporal ###

t-build:
	docker-compose -f ./docker-compose.yml -f ./docker-compose-temporal-worker.yml build

t-start:
	ORCHESTRATION_TOOL=temporal docker-compose -f ./docker-compose.yml -f ./docker-compose-temporal-worker.yml up -d

t-start-logs:
	ORCHESTRATION_TOOL=temporal docker-compose -f ./docker-compose.yml -f ./docker-compose-temporal-worker.yml up

t-down:
	docker-compose -f ./docker-compose.yml -f ./docker-compose-temporal-worker.yml down
