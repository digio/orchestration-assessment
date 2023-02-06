This Readme is specific for running Temporal in this PoC project.

# Temporal

## Running Temporal

You will need to run 2 processes:

1. The temporal cluster - you will need to set this up yourself as per your preferences. Follow the official docs at https://docs.temporal.io/application-development/foundations?lang=typescript#run-a-development-cluster. I chose to run it via cloning the docker-compose repo as instructed and then running it in a container, but other ways are possible.
2. The temporal worker inside the microservices app - there are 2 options of running the temporal worker:

### Local

Running this locally will make it faster to develop because you can hot reload.

First export the variables in your terminal:

```
export ORCHESTRATION_TOOL=temporal
export TEMPORAL_HOST=localhost
```

Then in same terminal:

```
cd microservices-app
npm run orchestrate
// OR
npm run orchestrate:watch // this will hot reload the worker if you make changes locally
```
1. When running the microservices stubs app remember that you will need to export env variables based on what you chose to run Temporal on.

### Docker compose

We will run the worker in Docker for our demo.

First ensure that the correct env variables are uncommented in the `docker-compose.yml` file:

```
# - TEMPORAL_HOST=localhost <=== Comment this one out
  - TEMPORAL_HOST=temporal-host <=== Uncomment this one so we connect to the host via Docker
```

Then in your terminal:

```
TODO !!! I haven't actually included the worker in the container yet
```

**Once you run Temporal, you will have these exposed:**
* Temporal Server: http://localhost:7233/
* Temporal UI: http://localhost:8080/

## Running the Poc for Temporal

### Run the App

Once you have Temporal and the worker running, you will need to run the app.

First ensure that the correct env variables are uncommented in the `docker-compose.yml` file:

```
  - ORCHESTRATION_TOOL=temporal <=== Uncomment this one so we will be running the Temporal demo
# - ORCHESTRATION_TOOL=conductor <=== Comment this one out
```

Then run the app. Refer to the `Setup` section for `Web App` in the main `Readme.md` file.

### Start the Demo

To start the Demo, go to the web app site at http://localhost:4000/ and submit a new credit card application form. That kicks off your Temporal workflow execution! 

You can follow the workflow along using:
* the Microservices Stub application logs either locally or in a container
* the Temporal UI

Have fun!
