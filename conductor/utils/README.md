**Please keep this folder and Readme up to date as we develop in case there are any changes**.

This folder contains the json config definitions for the Conductor workflows and tasks.
It also contains the seeding script to run whenever we spin up a new fresh Conductor container and need to populate is with the definitions again.

***IMPORTANT NOTE:***

These jsons definitions ARE SHARED with the Postman Collection json import configs, in order to avoid duplication. There is a script `generate_collection.sh` in the `/postman` folder that relies on these jsons definitions in order to generate the collection that can be imported into Postman.

# Seeding Conductor

1. Make sure you have a fresh Conductor setup running, whether locally or in a container (the API paths should remain the same).
2. In your terminal, from root folder, run:
   ```bash
   $ cd conductor-utils
   $ . seed_conductor.sh
   ```
3. You should now be able to hit any of the GET requests to find your workflow or task definitions or view them via the Conductor GUI.

# Updating the Conductor definitions

Whenever we want to update our Conductor workflow and task definitions, we need to update these json definition files because they are the source of truth.
You can choose to first trial all your changes in Postman or in the Conductor UI, but the final change must be made to the equivalent json definition file in the `/conductor-utils/definitions` folder and committed to the repository's origin. Please raise a PR and have it reviewed to avoid introducing errors accidentally.
