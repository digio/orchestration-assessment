#!/bin/bash
set -e

workflow_tag="\"<WORKFLOWDEF>\""
sub_workflow_tag="\"<SUBWORKFLOWDEF>\""
task_tag="\"<TASKDEFS>\""

template_path="collection-template/Orchestration POC.postman_collection.json"
output_folder="generated_collection"
output_path="$output_folder/Orchestration POC.postman_collection.json"

task_json_path="../conductor-utils/definitions/task_definitions.json"
main_workflow_json_path="../conductor-utils/definitions/new_credit_card_application_workflow.json"
sub_workflow_json_path="../conductor-utils/definitions/provision_credit_card_workflow.json"

function create_file {
  mkdir -p $output_folder
  cp "$template_path" "$output_path" # overwrites every time
}

function populate_request_bodies {
  path=$1
  tag=$2
  body=$(jq -Rs '.' $path)
  escaped_body=$(echo $body | sed 's/\\/\\\\/g')
  escaped_body=$(echo $escaped_body | sed 's/&/\\&/g')
  sed -i "" "s|$tag|$escaped_body|g" "$output_path"
}

echo Generating collection:
create_file
populate_request_bodies $task_json_path $task_tag
populate_request_bodies $sub_workflow_json_path $sub_workflow_tag
populate_request_bodies $main_workflow_json_path $workflow_tag

"$SHELL"
exit 0
