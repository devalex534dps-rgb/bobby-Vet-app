export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  const v = email.trim();
  if (!v) return "El correo electrónico es obligatorio.";
  if (!EMAIL_REGEX.test(v)) return "Ingresa un correo electrónico válido.";
  return null;
}

export function validatePasswordComplexity(password: string): string | null {
  if (!password) return "La contraseña es obligatoria.";
  if (password.length < 8) return "Debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(password)) return "Debe incluir al menos una letra mayúscula.";
  if (!/\d/.test(password)) return "Debe incluir al menos un número.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Debe incluir al menos un carácter especial.";
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  if (!value || !value.trim()) return `${label} es obligatorio.`;
  return null;
}
