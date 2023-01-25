This project contains the required stubs for the Orchestration Tools Proof of Concept that came about as a result of a 2022 API tech assessment at Digio. In this PoC, we are testing out different orchestration tools for microservices or processes that are likely to be used in an enterprise.

This PoC simulates a new customer credit card application in a bank.

To find out more about the requirements, please read: https://mantelgroup.atlassian.net/wiki/spaces/DIG/pages/4516413638/PoC+-+Orchestration+Tools+-+Conductor+vs+Temporal 

This project is designed to be ran in container for ease of use and reproduction.

# Orchestration Tools Setup

The Orchestration tools may be using overlapping ports. Since we don't want to modify the implementation of the external tools, just run them separately to ensure the ports are free.

<TBD>

# Web App

This web app contains:
* Form application for a new customer's credit card request

This is a standard out-of-the-box express app.

## Setup

### Mailtrap

<TBD>

## Running the Application

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

### Local

To install the app locally:

`cd web-app`

`npm i`

OPTION 1: To run app locally, first make sure you've installed the app at least once (as above) and that you exported all the environment variables we have in the `docker-compose` file, then:

`cd web-app`

`npm run serve`

Open web-app on http://localhost:4000/ 

OPTION 2: To run app in dev mode where your changes reflect automatically on the browser, do:

`cd web-app`

`npm run dev`

Open web-app on http://localhost:8000/ 