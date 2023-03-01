This Readme is specific for running Conductor in this PoC project.

# Conductor

Please **NOTE** that there may be some bugs in Conductor that we have recorded in our Jira project under the Conductor epic:
https://mantelgroup.atlassian.net/browse/OTP-2.
If you are having issues, that would be a good place to search in case we already visited them in this project.

## Prerequisites

* `orchestration-poc` repo cloned somewhere on your machine
* Local Docker service (e.g. Docker Desktop or Rancher Desktop)
* An active [Mailtrap.io](https://mailtrap.io) account with credentials provided as environment variables

## Getting started

This PoC has a few elements required to execute workflows in Conductor.

* ElasticSearch or OpenSearch for data indexing
* PostgreSQL for data persistence (optional)
* Conductor Server build with PostgreSQL connector
* Conductor UI
* Demo Microservices app

The simplest way to get up and running is to use the `docker-compose-conductor.yml` all-in-one docker compose file which will start all required components and expose only the bits you need to worry about.

**1. Build the container** with required components. If you encounter errors, please see the [potential issues](#potential-issues) section below.

```bash
$ docker-compose -f ./docker-compose-conductor.yml build
```

**2. Start the container**. Remember to first have your Mailtrap.io credentials set as environment variables either in your terminal or in the `.env` file. For more information refer to [README.md](#setting-up-notifications section).

**3. Populate Conductor** so that **Conductor** with the required definitions. This needs to only happen once at the start, or if you completely destroy the container images from your local machine. For instructions on how to populate Conductor refer to: `conductor/utils/README.md`.
```bash
$ ./conductor/utils/seed_conductor.sh
```

**4. Start a new workflow execution** by visiting the Microservices App and submitting the credit application form. You can monitor the workflow execution in the Conductor UI, under the **Executions** tab.
```bash
# Visit the Microservices App to submit the form
http://localhost:4000

# Visit the Conductor UI to monitor the workflow execution
http://localhost:5000
```

---

## Running conductor (the longer way)

If you'd like to use Conductor and not consume the all-in-one docker compose file, there are other ways to get it up and running.

* Download a packaged JAR file that will run the Conductor for you: [Running locally or with a JAR](https://conductor.netflix.com/gettingstarted/local.html)
* Spin up a container with all the relevant services through their docker compose option: [Running in a container](https://conductor.netflix.com/gettingstarted/docker.html)

Any containerised option is preferable for this PoC, unless you are trying to debug something internally within Conductor's implementation, in which case you will need to follow their Readme instructions on how to run it locally.

### Running Conductor separately (not the all-in-one option) using Docker

For this option you will need to clone the [Conductor repository](https://github.com/Netflix/conductor) and you will be running the docker compose file provided within the Conductor repo.

```shell
# Clone the Conductor repo
$ git clone https://github.com/Netflix/conductor.git

# Navigate to the right folder
$ cd conductor/docker
```

Before starting the Conductor service, you'll need to make a few changes to the `docker-compose.yml` config:

1. If you are using an M1 chip Mac, you will need to add to the docker compose file.
   Under the `elasticsearch` service, add `platform: "linux/amd64"`:
   ```
   elasticsearch:
    image: elasticsearch:6.8.15
    environment:
      - "ES_JAVA_OPTS=-Xms512m -Xmx1024m"
      - transport.host=0.0.0.0
      - discovery.type=single-node
      - xpack.security.enabled=false
    platform: "linux/amd64"  # <==== ADD THIS LINE HERE
    volumes:
      - esdata-conductor:/usr/share/elasticsearch/data
   ```
2. To allow the Microservices Stub to recognise the Conductor container network, add the following to the Conductor docker compose file.
   Under the `conductor-server` service, add our PoC's shared external network and give the server a name so we can find it:
   Furthermore the Conductor Java server comes in a default, unconfigured state.
3. Add a volume-mount to the `conductor/config-local.properties`. This file exists in the PoC repository, so depending on where you cloned **Conductor**, the location of the volume to mount may change. For example, if you have cloned this repo into a separate location, you might need to set the volume as: `../../orchestration-poc/conductor/config-local.properties:/app/config/config-local.properties`
4. ```
   conductor-server:
    environment:
      - CONFIG_PROP=config-local.properties
    image: conductor:server
    build:
      context: ../
      dockerfile: docker/server/Dockerfile
   # Add/change the following lines
    volumes:
      - ./conductor/config-local.properties:/app/config/config-local.properties
    networks:
      - internal
      - conductor-poc-network
    hostname: conductor-host 
    ports:
      - 8080:8080
   ```
   Then at the bottom of the file, add the external network to the config:
   ```
   networks:
    conductor-poc-network:   # <==== ADD THIS LINE HERE
      name: conductor-poc-network   # <==== ADD THIS LINE HERE
      external: true   # <==== ADD THIS LINE HERE
    internal:
   ```
5. To run the container, go to the root of the Conductor repo:
   ```
   cd docker
   docker compose up -d
   ```
6. To safely stop and delete the container (remember that this means you will need to re-seed; instructions below), run from the root of the Conductor repo:
   ```
   docker compose down
   ```
7. If you are having issues with Elastic Search spinning up properly,
8. refer to this Jira ticket: https://mantelgroup.atlassian.net/browse/OTP-34. The details and reasons are in the ticket. In case you have no access to Jira, here are some of the steps to fix the corrupt container are (in no particular order or level of effectiveness):
   1. to restart Docker or equivalent
   2. to first `docker compose up elasticsearch -d` and then compose regularly `docker-compose up -d`
   3. run `docker compose build`
   4. run `docker build -f docker/server/Dockerfile -t conductor:server .`
   5. Alternatively you can also replace ElasticSearch with OpenSearch, check the
      service *opensearch* in the `docker-compose-conductor.yml` file for more details.
   6. To enable persistence via PostgreSQL two additional steps are required:
      - before building the Conductor sources edit the `build.gradle` file
        in `server` and add the following to the `dependencies` section:
         ```groovy
        runtimeOnly 'com.netflix.conductor:conductor-postgres-persistence:3.13.3' 
        ```
      - then rebuild the Docker image for Conductor server:
         - if you're using the docker-compose.yml file from the Conductor
           source repository just run:
        ```shell
        docker compose build conductor-server
        ```
      - in addition the following Spring Data properties have to be set
        in the `config-local.properties` for Conductor to use PostgreSQL:
      ```properties
      conductor.db.type=postgres
      spring.datasource.url=jdbc:postgresql://postgres:5432/conductor
      spring.datasource.username=conductor
      spring.datasource.password=conductor
      spring.datasource.hikari.maximum-pool-size=10
      spring.datasource.hikari.minimum-idle=2
      ```

### Conductor API and Swagger links

* API: http://localhost:8080/api/
* Swagger: http://localhost:8080/swagger-ui/index.html?configUrl=/api-docs/swagger-config#/

## Potential issues

### Apple Silicon Mac
If you're running an Apple Silicon Mac (M1, M2, etc) you will have to
explicitly set the container image platform for the Elasticsearch
used by Conductor to `linux/amd64` as there is no ARM64 image available
for Elasticsearch 6.8.
In the conductor repo, you need to edit the
file `docker/docker-compose.yaml` and find the line
`image: elasticsearch:6.8.15`. Just before or after this line, with the
same indentation level, add `platform: linux/amd64` and save the file.

Furthermore in the `environment:` list you will need to add <br/>
`- bootstrap.system_call_filter=false`<br/>
in cases where you see an exception on ElasticSearch startup. HENDRIK which exception exactly?

### macOS 13 and newer
From macOS 13 onwards, Apple has AirPlay Receiver (from Control Center) listening on port 5000, which creates a port conflict with the conductor-ui. AirPlay Receiver is used for sharing Audio and Video from other Apple devices to the Mac. This feature is not used very often and therefore can be disabled to free up port 5000. But do so at your own risk, in case you still need this service on your Mac.

To disable AirPlay Receiver: Open `System Preferences`, search and click on `AirDrop` and then turn off
`AirPlay Receiver`.

### Elasticsearch timeout on startup
The docker compose startup of Elasticsearch can fail sometimes as it
can take a while and Docker will mark it as unhealthy after 1 minute
and abort the process.

If this happens, consider to increase the `healthcheck -> retries` property
in the Conductor `docker/docker-compose.yaml` file for the elasticsearch service from `12` to
`24` or more.

### Using OpenSearch over ElasticSearch
Considering ElasticSearch has the above issues, OpenSearch can be used as an
alternative. OpenSearch is an in-place replacement for ElasticSearch and is
fully API-compatible.
See the `docker-compose-conductor.uml` in this microservices-stubs repository for more details on how to set it up in Conductor's `docker/docker-compose.yaml`, or just run our All-in-one docker file instead where all issues have been resolved.

### Error `vm.max_map_count`

Depending on the current Docker VM configuration the error<br/>
`max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]`<br/>
can prevent successful startup of the search pods.

To increase that setting for the Docker VM use the `rdctl` command line tool<br/>
`rdctl shell sudo sysctl -w vm.max_map_count=262144`

### Running the PoC for Conductor

### Run the App

Once you have Conductor running and all definitions populated in Conductor, you will need to run the app using your [Mailtrap.io](https://mailtrap.io) credentials and setting the `ORCHESTRATION_TOOL` to `conductor`.

```bash
# Start the Microservices App
$ ORCHESTRATION_TOOL=conductor \
  POC_EMAIL_USER=<mailtrap_username> \
  POC_EMAIL_PASS=<mailtrap_password> \
  docker-compose up
```

---

## Running the demo

To start the Demo, go to the web app site at http://localhost:4000/ and submit a new credit card application form. That kicks off your Conductor workflow execution!

**Note** that you can kick off the workflow by also:
* sending a POST request to the server. Have a look at sample calls in the Postman collection. First make sure you generate the collection and export it as per the Reade at `postman/README.md`.
* clicking the run chevron start button the Conductor UI under the `Workbench` tab.

You can follow the workflow along using:
* the Microservices Stub application logs either locally or in a container
* the Conductor UI

Have fun!
