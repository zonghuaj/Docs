import {FormControl} from "@angular/forms";

export function isUrl(url) {
  return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(url);
}

// see mp-302
export const REGEX_K8S_NAME = /^[a-z]([-a-z0-9]{0,13}[a-z0-9])$/;
export const DESC_K8S_PLACEHOLDER = `包含小写字母和数字（a-z 和 0-9）的字符串，最大长度为15个字符，小写字母开头，小写字母或数字结尾`;

// see mp-302
export function k8sNameValid(name) {
  return REGEX_K8S_NAME.test(name);
}

// see mp-302
export function k8sNameFormValidor(control: FormControl, err?) {
  const valid = k8sNameValid(control.value);
  return valid ? null : {err};
}
