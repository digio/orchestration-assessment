**Please keep this folder and Readme up to date as we develop in case there are any changes**.

This folder contains a [Postman](https://www.postman.com/) collection of API calls that are available in this PoC that you may find useful when developing.

We have 2 sub-collections:
1. Conductor - includes calls that can be done on the Conductor server which would be exposed at http://localhost:8080/ whether you are running it locally or in a container as per COnductor's setup instructions.
2. Microservice Stub - includes calls for the express app mock which encompasses the services we are trying to orchestrate.

***NOTE:***

This collection has been kept relatively simple without any substitution of variables or environment configs. And that is to make it easy to import into other similar software other than Postman, such as [insomnia](https://insomnia.rest/), [testfully](https://testfully.io/), [nightingale](https://nightingale.rest/), etc.

# Importing the collection in Postman

1. Choose and install your tool of choice. For the purpose of this Readme, we are using [Postman](https://www.postman.com/downloads/). If you are choosing a different tool, it will be up to you to modify the collection json for your tool. Please keep your modified json local and do not commit it to the repository origin, as we do not want to have to maintain several collections. When making changes, make sure to update the Postman collection and only commit that.

2. Generate the collection json to import. In your terminal, from project root folder, run:
   ```bash
   $ cd postman
   $ . generate_collection.sh
   ```

3. The collection json is now generated at: `postman/generated_collection/Orchestration POC.postman_collection.json`. Do not commit this, it is purely for you to use now. When making changes to the collection with Postman, make sure to follow the instructions below.

3. In Postman, you can import the collection either via terminal or the GUI [official instructions](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman).

4. You should be now good to explore the API!

# Updating the collection

The collection template lives here: `postman/collection-template/Orchestration POC.postman_collection.json`.

To apply your changes you can either change the json file inline manually, or you can export the modified collection from Postman.

When updating the template file, do note that:

* Any changes to the POST and PUT bodies for the following endpoints in Conductor sub-collection will need to be changed elsewhere (as part of the generation scrips). This will ensure that we can still programmatically re-seed Conductor via a single command, with all updated changes to workflow and task definitions.

  * `http://localhost:8080/api/metadata/workflow` for `new_credit_card_application` workflow => the json body needs to be changed here: `conductor-utils/definitions/new_credit_card_application_workflow.json`. The template file references the body with tag `"<WORKFLOWDEF>"`. This must remain as is.


  *  `http://localhost:8080/api/metadata/workflow` for `provision_credit_card` workflow, or `http://localhost:8080/api/metadata/workflow  SUBWORKFLOW` => the json body needs to be changed here: `conductor-utils/definitions/provision_credit_card_workflow.json`. The template file references the body with tag `"<SUBWORKFLOWDEF>"`. This must remain as is.


  * `http://localhost:8080/api/metadata/taskdefs` => the json body needs to be changed here: `conductor-utils/definitions/task_definitions.json` . The template file references the body with tag `"<TASKDEFS>"`. This must remain as is.

* You can overwrite the template with the new updated contents of the modified collection export, but you will need to ensure that the above bullet point is preserved, otherwise the reseeding script for Conductor will break.