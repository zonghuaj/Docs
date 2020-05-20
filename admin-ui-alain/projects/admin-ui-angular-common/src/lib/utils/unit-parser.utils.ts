const KB = 1024;
const MB = 1024 * 1024;
const GB = 1024 * 1024 * 1024;
const TB = 1024 * 1024 * 1024 * 1024;

export function byteParser(limit: number, decimal = 2, suffix?: string): string {
  const negative = limit < 0;
  let size = '';
  limit = Math.abs(limit);
  if (limit < KB) {
    size = Number(limit.toFixed(decimal)) + 'B';
  } else if (limit < MB) {
    size = Number((limit / KB).toFixed(decimal)) + 'KiB';
  } else if (limit < GB) {
    size = Number((limit / MB).toFixed(decimal)) + 'MiB';
  } else if (limit < TB) {
    size = Number((limit / GB).toFixed(decimal)) + 'GiB';
  } else {
    size = Number((limit / TB).toFixed(decimal)) + 'TiB';
  }
  if (size.startsWith('NaN')) {
    return '-';
  } else {
    if (negative) size = `-${size}`;
    if (suffix) size += suffix;

    const sizestr = size + '';
    const len = sizestr.indexOf('\.');
    const dec = sizestr.substr(len + 1, 2);
    if (dec == '00') {
      return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
    }
    return sizestr;
  }
}

export function percentageParser(val: number, decimal = 2, suffix?: string): string {
  const str = val.toFixed(decimal) + '';
  return str + '%';
}

export function percentageParser2(val: number, decimal = 2, suffix?: string): string {
  if (isNaN(val)) {
    return '-';
  } else {
    const str = (val * 100).toFixed(decimal) + '';
    return str + '%';
  }
}

export function cpuCountParser(val: number, decimal = 2, suffix?: string) {
  const str = val.toFixed(decimal) + '';
  return str;
}

export function milliSecParser(val: number, decimal = 2, suffix?: string) {
  if (isNaN(val)) {
    return '-';
  } else {
    const str = (val * 1000).toFixed(decimal) + '';
    return str;
  }
}
