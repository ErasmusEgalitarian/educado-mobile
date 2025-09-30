export default function errorSwitch(error) {
  switch (error?.error?.code) {
    case "E0201":
      // User with this email already exists
      return "Usuário com este e-mail já existe";

    case "E0212":
      // Password is required
      return "Senha obrigatória";

    case "E0208":
      // Email is required
      return "E-mail obrigatório";

    case "E0207":
      // Email must be atleast 6 characters
      return "E-mail deve ter pelo menos 6 caracteres";

    case "E0206":
      // Email must contain "@" and "."
      return 'E-mail deve conter "@" e "."';

    case "E0203":
      // Invalid email format
      return "Formato de e-mail inválido";

    case "E0209":
      // First and last name is required
      return "Nome e sobrenome são obrigatórios";

    case "E0210":
      // Names must be between 1 and 50 characters
      return "Nomes devem ter entre 1 e 50 caracteres";

    case "E0211":
      // Names must only contain letters, spaces, hyphens and apostrophes
      return "Nomes devem conter apenas letras, espaços, hífens e apóstrofos";

    default:
      console.log(error);
      // Something unknown went wrong
      return "Erro desconhecido!";
  }
}
