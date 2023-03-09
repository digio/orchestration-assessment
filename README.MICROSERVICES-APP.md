This Readme is specific for running the Microservices App in this PoC project.

# Microservices App

In order to satisfy our banking microservices use case which includes different types of endpoints as well as a couple of forms, we've created a simple light-weight express web app, named "Microservices App". 

We've included the Temporal orchestration code within this express web app to keep things simple for the Temporal PoC. In a real production environment; the orchestration code may or may not live in its own separate app.

This web app contains:

* Form application for a new customer's credit card request
* Form application for credit limit manual approval
* Notification service
* Long polling API
* CRM API
* Temporal workflow and worker code

For a better view on the requirements, please see the [high level diagrams in the wiki](https://mantelgroup.atlassian.net/wiki/spaces/DIG/pages/4516413638/PoC+-+Orchestration+Tools+-+Conductor+vs+Temporal#High-Level-Workflow-Diagram). 

## Getting Started

You must first set up Mailtrap in your environment variables, as per instructions in section [Mailtrap](#mailtrap) below.

### Running the Demo

To run the PoC demo, you will need to run the Microservices App with one of the orchestration tools. Refer to each tool's readme as it will instruct you on how to run the app.

### Developing the Web App

You can choose to run the web app in a container, as per (Docker)[#docker] instructions, or on your local machine as per (Local)[#local].

---

## Mailtrap

We use [Mailtrap.io](https://mailtrap.io) and nodemailer in our notification service to send out emails to the "customer" and "banker".

You will need to create an account with Mailtrap, it is free: https://mailtrap.io/home. You can use whatever email or other entry point (Google, Github, etc) as you wish. This is exposing an SMTP to hit and monitor for you. It doesn't use your email to send the emails, only to log in to Mailtrap. Mailtrap has a UI that will show you the received emails.

Once you create your account you will be given a couple of keys by Mailtrap. You will need to update these keys in the environment variables `POC_EMAIL_USER` and `POC_EMAIL_PASS` for the Microservices App to work. See section [Environment Variables](#environment-variables).

To retrieve the credentials once more, you can find them in the Mailtrap Web UI in
Email Testing -> Inboxes -> My Inbox -> Show Credentials.

Use the Mailtrap UI to monitor any new emails sent out by our workflows.

## Environment Variables

For the Microservices App to work, these environment variables must be set:

```bash
ORCHESTRATION_TOOL=<temporal | conductor>
POC_EMAIL_USER=<mailtrap_username>
POC_EMAIL_PASS=<mailtrap_password>
```

** The `ORCHESTRATION_TOOL` variable determines what PoC to run for the Microservices App, whether `temporal` or `conductor`. However, this will already be pre-set for you, unless stated otherwise in the other readmes.

You can choose to set them into a `.env` file or pass them in before running `docker compose`.

### Using the `.env` file

A `.env` file is used for local environment-specific settings.
This file is NOT tracked in Git.

1. Create the file by copying `env.sample`:
   ```bash
   cp env.sample .env
   ```
2. edit the new file with the correct variables.

### Passing variables manually

```bash
$ ORCHESTRATION_TOOL=<temporal | conductor> \
  POC_EMAIL_USER=<mailtrap_username> \
  POC_EMAIL_PASS=<mailtrap_password> \
  docker compose up
```

---

## Docker

1. The dockerised web app uses port 4000 so ensure that it is free to use.

2. You must create the shared external networks before running the container (even if you are not running the Conductor or Temporal PoC, since they are baked in the docker compose file):

```bash
$ docker network create conductor-poc-network
$ docker network create temporal-poc-network
```

3. To build and start the container:

```bash
$ docker compose up --build -d
```

** Use tag `-d` to run it detached mode so that your terminal is not occupied by the process after it starts.

4. Open web-app on: http://localhost:4000/

## Local

### Prerequisites

1. Make sure to run all below commands within the `microservices-app` folder.
   ```bash
   $ cd microservices-app
   ```

2. You must make sure that you are running the correct node version as specified in `microservices-app/.nvmrc`. If you are using [nvm](microservices-app/.nvmrc), then remember to:
   ```bash
   $ nvm use
   ```

### Install the App

To install the app:

```bash
$ npm i
```

### Run the App

To run it you have a couple of options:

OPTION 1: 

This is how you would run it if it were "production" (and how the container would run the app):

```bash
$ npm run serve
```

Open web-app on: http://localhost:4000/

OPTION 2: 

To run app in dev mode where your changes reflect automatically on the browser (with hot-reload), do:

```bash
$ npm run dev
```

Open web-app on: http://localhost:8000/
