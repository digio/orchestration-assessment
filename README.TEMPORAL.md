This Readme is specific for running Temporal in this PoC project.

# Temporal

This PoC has three elements required to execute workflows in Temporal:

* **The Temporal Cluster** - The Temporal Cluster runs independently of the Microservice App and contains all the required Temporal services
* **The Temporal worker** - An independent process responsible for executing code for a task and responding to the Temporal Cluster with results. The Temporal Worker is an application that runs in the same container as the Microservices App and will start concurrently with the Microservices App's Temporal start command
* **Microservices App (with Temporal SDK)** - The Microservices App contains code simulating the microservices and code responsible for invoking the Temporal workflow and activities. It imports the Temporal SDK to connect to both the Temporal Server and the Temporal Worker. The workflows and activities used in this POC live in the `/orchestration` folder and are imported into both the Microservice App and Temporal Worker

Once running, the Temporal PoC will have the following components exposed:

* Temporal UI: http://localhost:8080
* Temporal Server: http://localhost:7233
* Microservices App: http://localhost:4000/ 

To better understand the Temporal PoC, please see the second blog in our blog series: LINK TBD. 

## Getting Started

### Prerequisites

* Local Docker (e.g. Docker Desktop or Rancher Desktop)
* The Temporal Cluster, which provides the Temporal services, cloned and running on your machine. Refer to [Running Temporal Cluster](#running-temporal-cluster) section.
* **Make sure** to set the `ORCHESTRATION_TOOL` environment variable to `temporal` and set your [Mailtrap.io](https://mailtrap.io) credentials. You can set the environment variables either in your terminal or in the `.env` file. For more information refer to `"Mailtrap"` and `"Environment Variables"` sections in the `README.MICROSERVICES_APP.md`.
* **Make sure** that you are running the correct node version as specified in `microservices-app/.nvmrc`. If you are using [nvm](microservices-app/.nvmrc), then remember to:
  ```bash
  $ cd microservices-app
  $ nvm use
  ```

### Running in Docker

Starting the Microservices App and Temporal Worker using Docker, mounts the app volume into the container so that you still have the ability to change files without having to re-build the container with every change. 

```bash
# Build the Microservices App container and Temporal worker
$ docker-compose -f ./docker-compose.yml -f ./docker-compose-temporal-worker.yml build

# Start the Microservices App and Temporal worker
$ ORCHESTRATION_TOOL=temporal \
  POC_EMAIL_USER=<mailtrap_username> \
  POC_EMAIL_PASS=<mailtrap_password> \
  docker-compose -f ./docker-compose.yml -f ./docker-compose-temporal-worker.yml up
```

### Running Locally

Starting the Microservices App and Temporal Worker locally provides the benefit of being able to play around with the code and make changes with a faster feedback cycle.

```bash
# Navigate to the Microservices App folder
$ cd microservices-app

# Start the Microservices App with file watching enabled
$ ORCHESTRATION_TOOL=temporal \
  POC_EMAIL_USER=<mailtrap_username> \
  POC_EMAIL_PASS=<mailtrap_password> \
  npm run start:temporal:watch  
```

### Running the demo

With the Microservices App and Temporal Worker up and running (either using the Local or Docker commands), you should be able to view the Demo UI running on http://localhost:4000. Submitting the form on this page will kick off a new Temporal workflow, which will be viewable in the Temporal UI on http://localhost:8080.

---

## Running Temporal Cluster

Temporal requires a number of services to be running in order to start executing workflows. To get things up and running, start by cloning the `docker-compose` repository provided by [Temporalio](https://github.com/temporalio/docker-compose) somewhere on your machine, and start it using using the following commands:

```bash
# Clone the docker-compose repository onto your machine, anywhere that makes sense

$ git clone https://github.com/temporalio/docker-compose.git
$ cd docker-compose

# Build the Temporal Cluster container
$ docker compose build

# Start the Temporal cluster container
$ docker compose up
```

** For more information, follow the official docs to get Temporal up and running at [Run a development cluster](https://docs.temporal.io/application-development/foundations?lang=typescript#run-a-development-cluster).

***It's important to start the Temporal Cluster first***, regardless of whether you are running the Microservices App locally or using Docker as it requires the cluster to be available.

Once running, you should be able to view the Temporal UI running on http://localhost:8080. For more details about the UI, [see the docs](https://docs.temporal.io/web-ui). Whilst not accessible through the browser, the Temporal Service will be running on http://localhost:7233.

---

### Potential Issues

#### Error occurred when executing the worker TransportError

If you see this error when starting the PoC via docker compose, it means that you haven't started the Temporal Cluster, and the worker has nothing to connect to. Please see [Temporal Cluster](#temporal-cluster) for details on how to start this.
