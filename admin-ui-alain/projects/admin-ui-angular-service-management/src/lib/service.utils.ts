'use strict';

export function surl(targetPath: string) {
  // return `${TENANT_ID}/project/${PROJECT_CODE}/${targetPath}`;
  return `$TENANT_ID/project/$PROJECT_CODE/${targetPath}`;
}
export function surlWithoutProject(targetPath: string) {
  // return `${TENANT_ID}/${targetPath}`;
  return `$TENANT_ID/${targetPath}`;
}
