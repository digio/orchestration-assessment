This Readme is specific for running Temporal in this PoC project.

# Temporal

## Prerequisites
* This repo cloned somewhere on your machine
* Node version 16 or greater
* The Temporal Cluster cloned and running on your machine (see below)
* An active [Mailtrap.io](https://mailtrap.io) account with credentials provided as environment variables

## Getting started

This POC has three elements required to execute workflows in Temporal:

1. **The Temporal Cluster** - A service running independently of the Microservice App.
2. **The Temporal worker** - An independent process responsible for executing code in response to a task and responding to the Temporal Cluster with results.
3. **Microservices App (with Temporal SDK)** - The application responsible for invoking the workflow and activities.

## Temporal Cluster

Temporal requires a number of services to be running (also known as the [Temporal Cluster](https://docs.temporal.io/clusters)) in order to start executing workflows. To get things up and running, start by cloning `docker-compose` repo provided by [Temporalio](https://github.com/temporalio/docker-compose) somewhere on your machine, and start it using using the following commands.

```bash
# Clone the docker-compose repo onto your machine, anywhere that makes sense

$ git clone https://github.com/temporalio/docker-compose.git
$ cd docker-compose

# Build the Temporal Cluster container
$ docker-compose build

# Start the Temporal cluster container
$ docker-compose up
```

***It's important to start the Temporal Cluster first***, regardless of whether you are running the Microservices App locally or using Docker as it requires the cluster to be available.

Once running, you should be able to view the [Temporal UI](http://localhost:8080) running on `http://localhost:8080`. For more details about the UI, [see the docs](https://docs.temporal.io/web-ui). Whilst not accessible through the browser, the Temporal Service will be running on `http://localhost:7233`.

## Temporal Worker

The Temporal Worker is an application that runs in the same container as the Microservices App and will start concurrently with the same Microservices App start command.

## Microservices App

The Microservices App simulates a real world microservice, and imports the Temporal SDK to connect to both the Temporal Server and the Temporal Worker. The workflows and activities used in this POC live in the `/orchestration` folder and are imported into both the Microservice App and Temporal Worker.

### Running locally

Starting the Microservices App and Temporal Worker locally provides the benefit of being able to play around with the code and make changes with a faster feedback cycle. Ensure you've provided your Mailtrap.io `username` and `password` as environment variables when running this command.

```bash
# Navigate to the Microservices App folder
$ cd microservices-app

# Start the Microservices App with file watching enabled
$ POC_EMAIL_USER=<mailtrap_username> \
  POC_EMAIL_PASS=<mailtrap_password> \
  npm run start:temporal:watch  
```

### Running in Docker

Starting the Microservices App and Temporal Worker using Docker mounts the app volume into the container so that you still have the ability to change files without having to re-build the container with every change. Ensure you've provided your Mailtrap.io `username` and `password` as environment variables when running this command.

```bash
# Build the Microservices App container
$ docker-compose -f ./docker-compose.temporal.yml build

# Start the Microservices App
$ POC_EMAIL_USER=<mailtrap_username> \
  POC_EMAIL_PASS=<mailtrap_password> \
  docker-compose -f ./docker-compose.temporal.yml up
```

---

## Running the demo

With the Microservices App and Temporal Worker up and running (either using the Local or Docker commands), you should be able to view the [Demo UI](http://localhost:4000) running on `http://localhost:4000`. Submitting the form on this page will kick off a new Temporal workflow, which will be viewable in the [Temporal UI](http://localhost:8080).

Have fun!
