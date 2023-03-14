This Readme is specific for running Conductor in this PoC project.

# Conductor

This PoC has a few elements that are required to execute workflows in Conductor:

* ElasticSearch or OpenSearch for data indexing
* PostgreSQL for data persistence (optional)
* Conductor Server build with PostgreSQL connector
* Conductor UI
* Demo Microservices app

Once running, the Conductor PoC will have the following components exposed:

* Conductor API: http://localhost:8080/api/
* Conductor UI: http://localhost:5000/
* Conductor Swagger: http://localhost:8080/swagger-ui/index.html?configUrl=/api-docs/swagger-config#/
* Microservices App: http://localhost:4000/ 

To better understand the Conductor PoC, please see the third blog in our blog series: LINK TBD. 

## Getting Started

### Prerequisites

* Local Docker (e.g. Docker Desktop or Rancher Desktop)
* An active [Mailtrap.io](https://mailtrap.io) account

### Running the Conductor PoC

The simplest way to get the demo PoC up and running is to use the all-in-one docker compose file called `docker-compose-conductor.yml`, which will start all required components for the PoC, including the Microservices App and Conductor itself (it will clone Conductor in the container). See [All-in-one Docker Compose File](#all-in-one-docker-compose-file) section below.

### Developing the Conductor PoC

For dev purposes, it may be easier to run Conductor and the Microservices App separately. See [Running Conductor and Microservices App Separately](#running-conductor-and-microservices-app-separately) section below.

---

## All-in-one Docker Compose File

**1. Build the container** with required components:

```bash
$ docker compose -f ./docker-compose-conductor.yml build
```

** If you encounter errors, please see the [potential issues](#potential-issues) section below.

**2. Start the container**. 

**Make sure** to first have your Mailtrap.io credentials set as environment variables either in your terminal or in the `.env` file. For more information refer to `"Mailtrap"` section in the `README.MICROSERVICES_APP.md`.

To start in detached mode (without logs), run:

```bash
$ docker compose -f docker-compose-conductor.yml up -d
```

Or, to start in foreground (in order to see the logs), run:

```bash
$ docker compose -f docker-compose-conductor.yml up
```

** For the first time, it is recommended to run the containers in the foreground where you can see the logs and any errors. Once you know everything is working, you can use detached mode, where you can free up your command line for other commands by running docker compose up with the `-d` option.

**3. Populate Conductor** with the required definitions for the PoC:

```bash
$ cd conductor/utils
$ . seed_conductor.sh
```

** This needs to only happen once at the start, or if you completely destroy the container images from your local machine. For further instructions on how to populate Conductor refer to: `conductor/utils/README.md`.

**4. Start a new workflow execution** by visiting the Microservices App and submitting the credit application form at http://localhost:4000. You can monitor the workflow execution in the Conductor UI at http://localhost:5000, under the **Executions** tab.

---

## Running Conductor and the Microservices App Separately

You may want to run Conductor separate to the Microservices App when you are developing.

To get Conductor up and running without using the pre-made all-in-one docker compose file mentioned above, you will need to run the Conductor container according to Conductor documentation: [Running in a container](https://conductor.netflix.com/gettingstarted/docker.html). 

### 1. Clone the Conductor Repository

```bash
$ git clone https://github.com/Netflix/conductor.git
```

### 2. Fix the Docker Compose File

Before starting the Conductor service, you'll need to make a few changes to the `docker/docker-compose.yml` config within the Conductor repository:

1. If you are using an M1 chip Mac, you will need to add `platform: "linux/amd64"` under the `elasticsearch` service to the docker compose file:
   ```
   elasticsearch:
    platform: "linux/amd64"
   ```
2. To allow the Microservices App to recognise the Conductor server, they must have a shared container network. Add the `conductor-poc-network` network to the Conductor docker compose file:
   ```
   conductor-server:
     networks:
      - internal
      - conductor-poc-network
   networks:
    conductor-poc-network:
      name: conductor-poc-network 
      external: true 
   ```
3. To fix ElasticSearch from timing out too quickly and thus failing to compose up or down, increase the `retries` property under `healthcheck` in the Conductor `docker/docker-compose.yaml` file for the `elasticsearch` service from `12` to `24` or more.
4. To enable persistence via PostgreSQL:
   - you will need to add the contents of `docker/docker-compose-postgres.yaml` to `docker/docker-compose.yaml`.
   - in the `server/build.gradle` file, you will need to add the following to the `dependencies` section:
      ```groovy
      runtimeOnly 'com.netflix.conductor:conductor-postgres-persistence:3.13.3'
      ```
   - then rebuild the Docker image for Conductor server:
     ```bash
     $ cd docker
     $ docker compose build conductor-server
     ```

### 3. Build and Start the Container

From the root of the Conductor repository:

```bash
$ cd docker
$ docker compose build

# Run in detached mode:
$ docker compose up -d

# OR, run in foreground (to see logs):
$ docker compose up
```

** For the first time, it is recommended to run the containers in the foreground where you can see the logs and any errors. Once you know everything is working, you can use detached mode, where you can free up your command line for other commands by running docker compose up with the `-d` option.

** If you still encounter errors, please see the [potential issues](#potential-issues) section below.

### 4. Populate Conductor

To populate Conductor with the required definitions for the PoC, you will need to run the following from the `microservices-stubs` repository root:

```bash
$ cd conductor/utils
$ . seed_conductor.sh
```

For further instructions on how to populate Conductor refer to: `conductor/utils/README.md`.

### 5. Run the Microservices App

Once you have Conductor running and all definitions populated in Conductor, you will need to set the `ORCHESTRATION_TOOL` environment variable to `conductor` and set your [Mailtrap.io](https://mailtrap.io) credentials. You can set the environment variables either in your terminal or in the `.env` file. For more information refer to `"Mailtrap"` and `"Environment Variables"` sections in the `README.MICROSERVICES_APP.md`.

To run the Microservices App, you will need to run the following from the `microservices-stubs` repository root:

```bash
$ ORCHESTRATION_TOOL=conductor \
  POC_EMAIL_USER=<mailtrap_username> \
  POC_EMAIL_PASS=<mailtrap_password> \
  docker compose up
```

### 6. Run the Demo

To start the Demo, go to the web app site at http://localhost:4000/ and submit a new credit card application form. That kicks off your Conductor workflow execution which you can view in the Conductor UI at http://localhost:5000, under the **Executions** tab!

**Note** that you can kick off the workflow by also:
* sending a POST request to the server. Have a look at sample calls in the Postman collection. First make sure you generate the collection and export it as per the Reade at `postman/README.md`.
* clicking the run chevron start button the Conductor UI at under the `Workbench` tab.

---

## Potential issues

### Apple Silicon Mac
If you're running an Apple Silicon Mac (M1, M2, etc) you will have to
explicitly set the container image platform for the Elasticsearch
used by Conductor to `linux/amd64` as there is no ARM64 image available
for Elasticsearch 6.8.
In the conductor repository, you need to edit the
file `docker/docker-compose.yaml` and find the line
`image: elasticsearch:6.8.15`. Just before or after this line, with the
same indentation level, add `platform: linux/amd64` and save the file.

Furthermore in the `environment:` list you will need to add <br/>
`- bootstrap.system_call_filter=false`<br/>
in cases where you see an exception on ElasticSearch startup.

### macOS 13 and newer
From macOS 13 onwards, Apple has AirPlay Receiver (from Control Center) listening on port 5000, which creates a port conflict with the conductor-ui. AirPlay Receiver is used for sharing Audio and Video from other Apple devices to the Mac. This feature is not used very often and therefore can be disabled to free up port 5000. But do so at your own risk, in case you still need this service on your Mac.

To disable AirPlay Receiver: Open `System Preferences`, search and click on `AirDrop` and then turn off
`AirPlay Receiver`.

### Elasticsearch timeout on startup
The docker compose startup of Elasticsearch can fail sometimes as it
can take a while and Docker will mark it as unhealthy after 1 minute
and abort the process.

If this happens, consider to increase the `healthcheck -> retries` property
in the Conductor `docker/docker-compose.yaml` file for the elasticsearch service from `12` to `24` or more.

### Using OpenSearch over ElasticSearch
Considering ElasticSearch has the above issues, OpenSearch can be used as an
alternative. OpenSearch is an in-place replacement for ElasticSearch and is
fully API-compatible.
See the `docker-compose-conductor.uml` in this microservices-stubs repository for more details on how to set it up in Conductor's `docker/docker-compose.yaml`, or just run our All-in-one docker file instead where all issues have been resolved.

### Error `vm.max_map_count`

Depending on the current Docker VM configuration the error<br/>`max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]`<br/>can prevent successful startup of the search pods.

To increase that setting for the Docker VM use the `rdctl` command line tool<br/>`rdctl shell sudo sysctl -w vm.max_map_count=262144`
