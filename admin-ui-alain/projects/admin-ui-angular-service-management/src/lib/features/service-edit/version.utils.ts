// env string is like "[{"name":"JAVAS","value":"AVAJS"}]"
export function envStr2Form(envStr: string): string {
  try {
    return JSON.parse(envStr).map(i => `${i.name}=${i.value}`).join(',');
  } catch (e) {
    return envStr;
  }
}

export function envForm2JSON(envStr) {
  if (!envStr) return '';
  return JSON.stringify(envStr.trim()
    .split(',')
    .map(i => {
      const iarr = i.split('=');
      if (iarr.length != 2) throw 'not a [k=v] pair';
      if (!iarr[0]) throw 'left key cannot be empty';
      return {name: iarr[0], value: iarr[1]}
    }).filter(i => !!i));
}
