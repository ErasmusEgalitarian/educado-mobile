import patterns from "@/assets/validation/patterns";

/**
 * Function for validating the password input. It checks if the password contains any emojis and if so it does not change the password state variable.
 * @param passwordInput input in password field
 * @returns either the password state variable or the confirm password state variable depending on the confirm parameter
 */
export const removeEmojis = (passwordInput: string) => {
  return passwordInput.replace(patterns.emoji, "");
};

/**
 * Checks if the password contains at least one letter
 * @param password
 * @returns true if password contains at least one letter, false otherwise
 */
export const validatePasswordContainsLetter = (password: string): boolean => {
  const regex = /.*\p{L}.*$/u;
  return regex.test(password);
};

/**
 * Checks if the password lives up to the length requirements
 * @param password
 * @returns true if password is longer than 7 characters, false otherwise
 */
export const validatePasswordLength = (password: string): boolean => {
  return password.length > 7;
};

/**
 * Validates the email according to the email pattern and
 * sets the state variable accordingly
 * @param email
 * @returns error message if email is invalid, empty string otherwise
 */
export const validateEmail = (email: string): string => {
  const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  if (!emailPattern.test(email)) {
    return "EMAIL INVÁLIDO"; // Email invalid
  }

  // Passed all checks, email is valid
  return "";
};

/**
 * Validates the real name according to the real name pattern.
 * (Used for both first and last name)
 * @param name
 * @param wordForName (e.g. 'Nome' or 'Sobrenome')
 * @returns error message if name is invalid, empty string otherwise
 */
export const validateName = (name: string, wordForName: string = "Nome"): string => {
  if (name.length > 50) {
    // Check this number
    return `${wordForName} muito longo`; // Name too long
  }
  if (name.length < 1) {
    return `${wordForName} obrigatório`; // Name required
  }

  if (!patterns.name.test(name)) {
    return `${wordForName} inválido`; // Invalid name
  }

  return "";
};
