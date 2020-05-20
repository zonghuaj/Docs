'use strict';

export function surlWithDockerfile() {
  return `$TENANT_ID/project/$PROJECT_CODE/dockerfiles`;
}

export function surlWithJenkinsfile() {
  return `$TENANT_ID/project/$PROJECT_CODE/jenkinsfile`;
}

export function surlWithJenkinsConfig() {
  return `$TENANT_ID/project/$PROJECT_CODE/jenkinsConfig`;
}

export function surlWithProjectTypes() {
  return `$TENANT_ID/project/$PROJECT_CODE/projectType`;
}

export function surlWithProject() {
  return `$TENANT_ID/project/$PROJECT_CODE/project`;
}

export function surlWithPipeline() {
  return `$TENANT_ID/project/$PROJECT_CODE/pipelines`;
}

export function surlWithPipelineLog() {
  return `$TENANT_ID/project/$PROJECT_CODE`;
}

export function surlWithPipelineDetialLog() {
  return `$TENANT_ID/project/$PROJECT_CODE/pipelineLog`;
}

export function surlWithUTLog() {
  return `$TENANT_ID/project/$PROJECT_CODE/UT`;
}

export function surlWithDeployInfo() {
  return `$TENANT_ID/project/$PROJECT_CODE/deploy`;
}
