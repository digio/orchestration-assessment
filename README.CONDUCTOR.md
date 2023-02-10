This Readme is specific for running Conductor in this PoC project.

# Conductor

Please **NOTE** that there may be some bugs in Conductor that we have recorded in our Jira project under the Conductor epic:
https://mantelgroup.atlassian.net/browse/OTP-2.
If you are having issues, that would be a good place to search in case we already visited them in this project.

# Preconditions
- a local Docker service (e.g. Docker Desktop or Rancher Desktop)
- a working Internet connection

## Running Conductor

You can either clone the repo and run Conductor in local command line processes, download a packaged JAR file that will run the Conductor for you, or you can spin up a container with all the relevant services through their docker compose option.

We have also provided a docker compose file that will spin up Conductor in containers locally for you by pulling the repo and building it. Choose your preferred option and follow the instructions below.


Instructions can be found here:

[Running locally or with a JAR](https://conductor.netflix.com/gettingstarted/local.html)

[Running in a container](https://conductor.netflix.com/gettingstarted/docker.html)

The containerised option is preferable for this PoC, unless you are trying to debug something internally within Conductor's implementation, in which case you will need to follow their Readme instructions on how to run it locally. I tried all options and they all work.

**Once you run Conductor, you will have these exposed:**
* Conductor Server: http://localhost:8080/api/
* Conductor UI: http://localhost:5000/
* Conductor Swagger: http://localhost:8080/swagger-ui/index.html?configUrl=/api-docs/swagger-config#/

and the demo POC app:
* The POC demo app: http://localhost:4000/


## Setting up Conductor

### Potential issues

#### Apple Silicon Mac
If you're running an Apple Silicon Mac (M1, M2 etc.) you will have to
explicitly set the container image platform for the Elasticsearch
used by Conductor to `linux/amd64` as there is no ARM64 image available
for Elasticsearch 6.8.
To do this in the below Prepare steps after cloning you need to edit the
file `docker/docker-compose.yaml` and find the line
`image: elasticsearch:6.8.15`. Just before or after this line, with the
same indentation level, add `platform: linux/amd64` and save the file.

Furthermore in the `environment:` list you will need to add <br/>
`- bootstrap.system_call_filter=false`<br/>
in cases where you see an exception on ElasticSearch startup.

#### macOS 13 and newer
With macOS 13 Apple introduced the Control Center (as known from iOS)
which is nice but introduces a port conflict with the conductor-ui as
both applications listen on port 5000.

More specifically the service listening is called AirPlay Receiver and
is used for sharing Audio and Video from other Apple devices to the Mac.
Usually this is a quite useless feature and therefore we can disable it
and by doing so free up port 5000.

Open System Preferences, search and click on AirDrop and then turn off
AirPlay Receiver.

#### Elasticsearch timeout on startup
The docker compose startup of Elasticsearch can fail sometimes as it
can take a while and Docker will mark it as unhealthy after 1 minute
and abort the start.

If this happens consider to increase the `healthcheck -> retries` property
in the docker-compose.yaml file for the elasticsearch service from `12` to
`24` or more.

#### Using OpenSearch over ElasticSearch
As ElasticSearch has some issues like the Apple Silicon limitation and
higher resource requirements one can choose to use OpenSearch as an
alternative. OpenSearch is an in-place replacement for ElasticSearch and
fully API-compatible.
See the `docker-compose-conductor.uml` for more details on how to set it up.

#### Error `vm.max_map_count`

Depending on the current Docker VM configuration the error<br/>
`max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]`<br/>
can prevent successful startup of the search pods.

To increase that setting for the Docker VM use the `rdctl` command line tool<br/>
`rdctl shell sudo sysctl -w vm.max_map_count=262144`


## Docker compose

## All-in-one option

The file `docker-compose-conductor.yml` will clone the Conductor 
repository, build the sources and create local Docker images for
Conductor and Conductor UI.
It will then set up all required containers and network configuration 
required to work with Conductor locally.

The following containers will be started:
* OpenSearch for data indexing
* PostgreSQL for data persistence
* Conductor Server build with PostgreSQL connector
* Conductor UI
* Express demo app

When running the first time start by executing a `build` of required containers
as the Conductor project does not provide official Docker containers.

From the project root folder (the same this file is in) run
```shell
docker compose -f docker-compose-conductor.yml build
```

This process will take a few minutes.

Afterwards start the containers using Docker Compose. For development
purposes it is recommended to not start the containers as in daemon mode 
(`-d` option) but instead in foreground to see potential errors.

To start run
```shell
docker compose -f docker-compose-conductor.yml up
```

To stop the containers either hit `Ctrl+C` in the terminal where 
docker compose is running, or on a second terminal execute the 
`down` command as this:

```shell
docker compose -f docker-compose-conductor.yml down
```

## From Conductor Docker Compose

For this option you will need to clone the [Conductor repository](https://github.com/Netflix/conductor) and you will be running the docker compose file provided within the Conductor repo.

Once you have cloned the docker compose files. You will need to make some modifications to ensure the PoC is working:

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
    platform: "linux/amd64"  <==== ADD THIS LINE HERE
    volumes:
      - esdata-conductor:/usr/share/elasticsearch/data
   ```
2. To allow the Microservices Stub to recognise the Conductor container network, add the following to the Conductor docker compose file.
   Under the `conductor-server` service, add our PoC's shared external network and give the server a name so we can find it:
   Furthermore the Conductor Java server comes in a default, unconfigured state.
3. Add a volume-mount to the `conductor/config-local.properties`.
3. ```
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
    conductor-poc-network:   <==== ADD THIS LINE HERE
      name: conductor-poc-network   <==== ADD THIS LINE HERE
      external: true   <==== ADD THIS LINE HERE
    internal:
   ```
3. To run the container, go to the root of the Conductor repo:
   ```
   cd docker
   docker compose up -d
   ```
4. To safely stop and delete the container (remember that this means you will need to re-seed; instructions below), run from the root of the Conductor repo:
   ```
   docker-compose down
   ```
5. If you are having issues with Elastic Search spinning up properly, refer to this Jira ticket: https://mantelgroup.atlassian.net/browse/OTP-34. The details and reasons are in the ticket. In case you have no access to Jira, here are some of the steps to fix the corrupt container are (in no particular order or level of effectiveness):
   1. to restart Docker or equivalent
   2. to first `docker-compose up elasticsearch -d` and then compose regularly `docker-compose up -d`
   3. run `docker-compose build`
   4. run `docker build -f docker/server/Dockerfile -t conductor:server .`
   5. replace Elastic Search with Open Search by: HENDRIK ADD HERE

## Creating the workflows

Once Conductor is up and running, you will need to make sure that you populate your workflow and task definitions. This is done by sending requests to the Conductor server, and it handles everything else for you. 

For instructions on how to "seed" or populate Conductor refer to: `conductor-utils/README.md`.

## Running the Poc for Conductor

### Run the App

Once you have Conductor running and all definitions populated in Conductor, you will need to run the app.

First ensure that the correct env variables are uncommented in the `docker-compose.yml` file in this Microservices Stub repo:

```
# - CONDUCTOR_HOST=localhost <=== Comment this one out
  - CONDUCTOR_HOST=conductor-host <=== Uncomment this one so we connect to the host via Docker
# - ORCHESTRATION_TOOL=temporal <=== Comment this one out
  - ORCHESTRATION_TOOL=conductor <=== Uncomment this one so we will be running the Conductor demo
```

Then run the app. Refer to the `Setup` section for `Web App` in the main `Readme.md` file.

### Start the Demo

To start the Demo, go to the web app site at http://localhost:4000/ and submit a new credit card application form. That kicks off your Conductor workflow execution! 

**Note** that you can kick off the workflow by also:
* sending a POST request to the server. Have a look at sample calls in the Postman collection. First make sure you generate the collection and export it as per the Reade at `postman/README.md`.
* clicking the run chevron start button the Conductor UI under the `Workbench` tab.

You can follow the workflow along using:
* the Microservices Stub application logs either locally or in a container
* the Conductor UI

Have fun!
