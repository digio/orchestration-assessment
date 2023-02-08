This project contains the required stubs for the Orchestration Tools Proof of Concept that came about as a result of a 2022 API tech assessment at Digio. In this PoC, we are testing out different orchestration tools for microservices or processes that are likely to be used in an enterprise.

This PoC simulates a new customer credit card application in a bank.

To find out more about the requirements, please read: https://mantelgroup.atlassian.net/wiki/spaces/DIG/pages/4516413638/PoC+-+Orchestration+Tools+-+Conductor+vs+Temporal 

This project is designed to be ran in container for ease of use and reproduction.

# Orchestration Tools Setup

The Orchestration tools may be using overlapping ports. Since we don't want to modify the implementation of the external tools, just run them separately to ensure the ports are free.

Check the Jira board for any bugs that are related to set up if you see that things aren't working.

## Temporal
Please refer to `README.TEMPORAL.md`.

## Conductor
Please refer to `README.CONDUCTOR.md`.

# Web App

This web app contains:
* Form application for a new customer's credit card request
* Temporal workflow and worker code
* Notification service
* Long polling API
* CRM API

This is a standard out-of-the-box express app with plain Javascript and PUG ui library. Those were chosen in order to keep the stubs are simple and lightweight as possible, remembering that this is just a PoC.

## Setup

### Local `.env` file

A `.env` file is used for local environment-specific settings.
This file is NOT tracked in Git.

To start copy the file `env.sample` and then edit the new file.
```shell
cp env.sample .env
```
Uncomment the correct line for the orchestration tool you want to work with.

### Mailtrap

We use Mailtrap and nodemailer in our notification service to send out emails to the "customer" and "banker". 

You will need to create an account with Mailtrap, it is free: https://mailtrap.io/home. You can use whatever email or other entry point (Google, Github, etc) as you wish. This is exposing an SMTP to hit and monitor for you. It doesn't use your email to send the emails, only to log in to Mailtrap. Mailtrap has a UI that will show you the received emails.

Once you create your account you will be given a couple of keys by Mailtrap. You will need to update these keys in the repo for the project to work.

Next edit the `.env` file created earlier and update the two environemnt variables inside the file.

The necessary credentials can be found in the Mailtrap Web UI in
Email Testing -> Inboxes -> My Inbox -> Show Credentials.

Use the Mailtrap UI to monitor any new emails sent out by our workflows.

## Running the Microservices Application

### Docker

The dockerised web app uses port 4000 so ensure that it is free to use.

To interact with the Orchestration tools' docker networks, do create the shared external networks before running the container:
`docker network create conductor-poc-network`
`docker network create temporal-poc-network`

#### With Dockerfile:

To build the image:

`docker build . -t microservices-web-app`

To start the container:

[use tag -d to run it detached mode so that your terminal is not occupied by the process after it starts]

`docker run -p 4000:4000 microservices-web-app -d`

#### With docker-composer:

To build and start the container:

[use tag -d to run it detached mode so that your terminal is not occupied by the process after it starts]

`docker-compose up --build -d`

Note that all the docker compose commands are in the `Makefile`. You can go to your terminal and from the root of this project write `make <command name>` and it will run the commands for you. For example, `make refresh` is going to be a fairly useful one to reload the container with any new changes.

### Local

To install the app locally:

`cd web-app`

`npm i`

To run app locally, first make sure you've installed the app at least once (as above) and that you exported all the environment variables we have in the `docker-compose.yml` file:

```
export NODE_ENV=development
export POC_EMAIL_USER=<insert_mailtrap_user_key>
export POC_EMAIL_PASS=<insert_mailtrap_pass_key>
export ORCHESTRATION_TOOL=<choose temporal or conductor based on what workflow you are testing>
export CONDUCTOR_HOST=localhost
export TEMPORAL_HOST=localhost
```

To run it you have a couple of options:

OPTION 1: This is how you would run it if it were "production" (and how the container would run the app):

`cd web-app`

`npm run serve`

Open web-app on http://localhost:4000/ 

OPTION 2: To run app in dev mode where your changes reflect automatically on the browser, do:

`cd web-app`

`npm run dev`

Open web-app on http://localhost:8000/ 

# Postman Collection
Please refer to `postman/README.md`.
