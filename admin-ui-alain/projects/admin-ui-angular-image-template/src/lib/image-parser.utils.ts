export function parseStages(code) {
  const params = [];
  const reg = /stage\('(.+?)'\)/g;
  let match;
  while ((match = reg.exec(code)) !== null) {
    params.push(match[1]);
  }
  return params;
}

export function parseCustomParameters(code) {
  const params = [];
  const reg = /{{(([A-Z]|[a-z])\w{0,19})}}/g;
  let match;
  while ((match = reg.exec(code)) !== null) {
    params.push(match[1]);
  }
  return Array.from(new Set(params)); // [...new Set(params)] is not allowed here
}
