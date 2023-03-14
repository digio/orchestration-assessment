#!/bin/bash

# Copyright 2023 Mantel Group Pty Ltd

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#    http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

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
