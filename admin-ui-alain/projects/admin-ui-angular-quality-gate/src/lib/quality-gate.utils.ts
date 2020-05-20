import {RuleMetric} from './entities/quality-gate-rule.entities';

export function getLvlRating(value) {
  return ratingFormatter(value);
}

// copied from Sonar-UI ../helpers/measure.js
function ratingFormatter(value: string | number): string {
  if (typeof value === 'string') {
    value = parseInt(value, 10);
  }
  return String.fromCharCode(97 + value - 1).toUpperCase();
}

export function getCoverageLvl(value) {
  if (value === 100) {
    return 100;
  } else if (value < 100 && value >= 80) {
    return 85;
  } else if (value < 80 && value >= 70) {
    return 72.5;
  } else if (value < 70 && value >= 50) {
    return 60;
  } else if (value < 50 && value >= 30) {
    return 45;
  } else if (value < 30 && value >= 0) {
    return 15;
  } else {
    return NaN;
  }
}

export function getDupLvl(value) {
  if (value >= 0 && value < 3) {
    return 1;
  } else if (value >= 3 && value < 5) {
    return 2;
  } else if (value >= 5 && value < 10) {
    return 3;
  } else if (value >= 10 && value < 20) {
    return 4;
  } else if (value >= 20 && value <= 100) {
    return 5;
  } else {
    return NaN;
  }
}

export function getNCLoCLvl(value) {
  if (value < 1000) {
    return 1;
  } else if (value >= 1000 && value < 10000) {
    return 2;
  } else if (value >= 10000 && value < 100000) {
    return 3;
  } else if (value >= 100000 && value < 500000) {
    return 4;
  } else {
    return 5;
  }
}

export function findMetric(key: string, metrics: RuleMetric[]) {
  return metrics.find(m => m.key === key);
}
