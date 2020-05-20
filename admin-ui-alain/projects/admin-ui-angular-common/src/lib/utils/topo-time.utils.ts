/**
 * The following 3 methods copied from skywalking,
 * mainly to judge the startTime and endTime,
 * if WITHIN ONE MONTH step = DAYS
 *    WITHIN ONE DAY   step = HOURS
 *    WITHIN ONE HOUR  step = MINUTES
 *    ELSE             step = MONTHS
 * @param start
 * @param end
 */
export function inAMonth(start: Date, end: Date) {
  const unix = Math.round(end.getTime()) - Math.round(start.getTime());
  return unix <= 30 * 24 * 60 * 60 * 1000;
}

export function inADay(start: Date, end: Date) {
  const unix = Math.round(end.getTime()) - Math.round(start.getTime());
  return unix <= 24 * 60 * 60 * 1000;
}

export function inAnHour(start: Date, end: Date) {
  const unix = Math.round(end.getTime()) - Math.round(start.getTime());
  return unix <= 60 * 60 * 1000;
}
