# Orchestrating Microservices: Conductor vs Temporal PoC

This project contains the required components for the Conductor vs Temporal Orchestration Tools Proof of Concept (PoC) that came about as a result of a 2022 API tech assessment at DigIO. In this PoC, we are testing out different orchestration tools for microservices that are likely to be used in an enterprise.

This PoC simulates a new customer credit card application in a bank.

To find out more about the project, please read the [blog series, starting with part 1](https://digio.com.au/learn/blog/orchestrating-microservices/).

This project contains:

* **Microservices App** - stubs for the credit card microservices and forms
* **Temporal orchestration code** - lives within the Microservices App but is only needed for the Temporal demo
* **Conductor definitions** - lives within `/conductor/utils` and is only needed for the Conductor demo
* **Different docker compose files** to run the above 3 components
* **3 separate readmes** for the 3 components

## Getting Started

We recommend assessing each orchestration tool separately otherwise there may be conflicts (such as overlapping ports).

** Note that all the docker compose commands are in the Makefile. You can go to your terminal and from the root of this project write `make <command name>` and it will run the commands for you.

### Temporal

Please refer to `README.TEMPORAL.md` if you want to run or develop the Temporal PoC.

### Conductor

Please refer to `README.CONDUCTOR.md` if you want to run or develop the Conductor PoC.

### Microservices App

Please refer to `README.MICROSERVICES-APP.md` if you want to run the Microservices App separately to the Temporal or Conductor PoCs.

## Postman Collection: Microservices App and Conductor

Please refer to `postman/README.md`.
