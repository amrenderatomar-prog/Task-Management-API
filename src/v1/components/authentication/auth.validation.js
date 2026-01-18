export const registerValidation = (data) => {
  const { name, email, password } = data;

  if (!name || !email || !password) return "All fields are required";

  // Strong password strength check
  if (password.length < 8) return "Password must be at least 8 characters long";

  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one digit";

  return null;
};
