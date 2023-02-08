#!/bin/bash
set -e

workflow_url="http://localhost:8080/api/metadata/workflow"
task_url="http://localhost:8080/api/metadata/taskdefs"

task_json_path="definitions/task_definitions.json"
main_workflow_json_path="definitions/new_credit_card_application_workflow.json"
sub_workflow_json_path="definitions/provision_credit_card_workflow.json"

function run_query {
  process_name=$1
  data=$2
  url=$3
  echo Running $process_name:
  result=$(curl -i \
  -H "Accept: */*" \
  -H "Content-Type:application/json" \
  -X POST $url --data @$data)
  echo -e "=nResult of $process_name:\n$result\n"
}

run_query "populate_tasks" $task_json_path $task_url
run_query "populate_main_workflow" $main_workflow_json_path $workflow_url
run_query "populate_sub_workflow" $sub_workflow_json_path $workflow_url
