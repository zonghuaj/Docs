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
