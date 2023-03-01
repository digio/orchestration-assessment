# Orchestrating Microservices: Conductor vs Temporal PoC

This project contains the required stubs for the orchestration tools Proof of Concept that came about as a result of a 2022 API tech assessment at DigIO. In this PoC, we are testing out different orchestration tools for microservices or processes that are likely to be used in an enterprise.

This PoC simulates a new customer credit card application in a bank.

To find out more about the requirements, please read the [wiki](https://mantelgroup.atlassian.net/wiki/spaces/DIG/pages/4516413638/PoC+-+Orchestration+Tools+-+Conductor+vs+Temporal).

## Getting started

We recommend assessing each orchestration tool separately otherwise there may be conflicts (such as overlapping ports).

Check the [Jira board](https://mantelgroup.atlassian.net/jira/software/c/projects/OTP/boards/85) for any bugs that are related to set up if you see that things aren't working, or see the `Potential Issues` section of each relevant tool's readme.

## Assessing each orchestration tool

### Temporal

Please refer to [README.TEMPORAL.md](https://gitlab.mantelgroup.com.au/digio/tech-assessments/orchestration-poc/-/blob/master/README.TEMPORAL.md).

### Conductor

Please refer to [README.CONDUCTOR.md](https://gitlab.mantelgroup.com.au/digio/tech-assessments/orchestration-poc/-/blob/master/README.CONDUCTOR.md).


## Web App

We've created a web app (referred to as the Microservices App) to simulate a few microservices in the wild and to host the form required to submit the credit application. For the purposes of evaluating Temporal, the orchestration code lives in this codebase, which may or may not be the case in a real production environment.

For a better view on the requirements, please see the [high level workflow diagram](https://mantelgroup.atlassian.net/wiki/spaces/DIG/pages/4516413638/PoC+-+Orchestration+Tools+-+Conductor+vs+Temporal#High-Level-Workflow-Diagram). Other features that make up this Microservices App are:

* Notification service
* Long polling API
* CRM API

## Environment variables

Before diving into either of the orchestration tools, make sure to set the required environment variables.

```shell
ORCHESTRATION_TOOL=<temporal | conductor>
POC_EMAIL_USER=<mailtrap_username>
POC_EMAIL_PASS=<mailtrap_password>
```

* `POC_EMAIL_USER` and `POC_EMAIL_PASS`: We are using a MailTrap.io account as part of our notification service stub. For more information see the [Mailtrap](#setting-up-notifications) section.

* `ORCHESTRATION_TOOL`: This variable determines what PoC to run for the Microservices App. However, this will already be preset for you, unless stated otherwise in the other readmes.

These environment variables can be set into a `.env` file or by passing them in before running `docker-compose`.

### Using the `.env` file

A `.env` file is used for local environment-specific settings.
This file is NOT tracked in Git.

To start copy the file `env.sample` and then edit the new file.
```shell
cp env.sample .env
```

### Passing variables manually

```shell
$ ORCHESTRATION_TOOL=<temporal | conductor> \
  POC_EMAIL_USER=<mailtrap_username> \
  POC_EMAIL_PASS=<mailtrap_password> \
  docker-compose up
```

## Setting up notifications

We use [Mailtrap.io](https://mailtrap.io) and nodemailer in our notification service to send out emails to the "customer" and "banker". 

You will need to create an account with Mailtrap, it is free: https://mailtrap.io/home. You can use whatever email or other entry point (Google, Github, etc) as you wish. This is exposing an SMTP to hit and monitor for you. It doesn't use your email to send the emails, only to log in to Mailtrap. Mailtrap has a UI that will show you the received emails.

Once you create your account you will be given a couple of keys by Mailtrap. You will need to update these keys in the repo for the project to work.

Next edit the `.env` file created earlier and update the two environment variables `POC_EMAIL_USER` and `POC_EMAIL_PASS`, or pass them in manually.

The necessary credentials can be found in the Mailtrap Web UI in
`Email Testing -> Inboxes -> My Inbox -> Show Credentials`.

Use the Mailtrap UI to monitor any new emails sent out by our workflows.

## Postman Collection: Microservices App and Conductor

We've included a collection of endpoints for use with [Postman](https://www.postman.com/) in the event you'd like to dig a little deeper, or avoid using the included Microservice App UI. This collection also includes the workflow and definitions used for Conductor, great for seeing how everything ties together or adding your own workflow and definitions. You'll find all the necessary details in [postman/README.md](https://gitlab.mantelgroup.com.au/digio/tech-assessments/orchestration-poc/-/blob/master/postman/README.md).
