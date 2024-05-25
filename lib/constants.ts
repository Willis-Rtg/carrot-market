export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 25;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERR_MSG = `Passwords must contain at least on UPPERCASE, lowercase, number, and special characters #?!@$%^&*-`;
