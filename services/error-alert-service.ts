// TODO: Perhaps some of them should urge the user to contact support?
// TODO: Verify these translatios with Luiza

import ShowAlert from "../components/General/ShowAlert";

/**
 * // Show standard error message for each error code received from the backend.
 * // Use with some caution - some of these errors are not really meant for users.
 * @param {String} errorCode
 */
export function alertErrorCode(errorCode) {
  // Hard coded to use BR for now
  ShowAlert(ERROR_CODES[errorCode]["br"] ?? ERROR_CODES["E0000"]["br"]);
}

export const ERROR_CODES = {
  // E00 - General errors
  E0000: {
    en: "Unknown error",
    br: "Erro desconhecido",
  },
  E0001: {
    en: "Authentication token is invalid or expired.",
    br: "O token de autenticação é inválido ou expirou.",
  },
  E0002: {
    en: "Users role does not have the necessary permissions for this action",
    br: "O papel do usuário não tem as permissões necessárias para esta ação",
  },
  E0003: {
    en: "Server could not be reached",
    br: "Não foi possível contatar o servidor",
  },
  E0004: {
    en: "User not found",
    br: "Usuário não encontrado",
  },
  E0005: {
    en: "No courses found",
    br: "Nenhum curso encontrado",
  },
  E0006: {
    en: "Course not found",
    br: "Curso não encontrado",
  },
  E0007: {
    en: "No sections found",
    br: "Nenhuma seção encontrada",
  },
  E0008: {
    en: "Section not found",
    br: "Seção não encontrada",
  },
  E0009: {
    en: "Course does not contain sections",
    br: "O curso não contém seções",
  },
  E0010: {
    en: "Email could not be sent",
    br: "O e-mail não pôde ser enviado",
  },
  E0011: {
    en: "No exercises found",
    br: "Nenhum exercício encontrado",
  },
  E0012: {
    en: "Exercise not found",
    br: "Exercício não encontrado",
  },
  E0013: {
    en: "Content creator not found",
    br: "Criador de conteúdo não encontrado",
  },
  E0014: {
    en: "Invalid id",
    br: "ID inválido",
  },

  // E01 - Login errors
  E0101: {
    en: "Invalid email",
    br: "E-mail inválido",
  },
  E0102: {
    en: "Account is locked due to multiple failed login attempts. Please try again later.",
    br: "A conta está bloqueada devido a várias tentativas de login malsucedidas. Por favor, tente novamente mais tarde.",
  },
  E0103: {
    en: "Account is not verified. Please check your email for a verification link.",
    br: "A conta não está verificada. Por favor, verifique seu e-mail para obter o link de verificação.",
  },
  E0104: {
    en: "Account is suspended or blocked by an administrator.",
    br: "A conta está suspensa ou bloqueada por um administrador.",
  },
  E0105: {
    en: "Invalid password",
    br: "Senha inválida",
  },

  // E02 - Signup errors
  E0201: {
    en: "User with the provided email already exists.",
    br: "Já existe um usuário com o e-mail fornecido.",
  },
  E0202: {
    en: "Password does not meet the minimum requirements.",
    br: "A senha não atende aos requisitos mínimos.",
  },
  E0203: {
    en: "Invalid email format.",
    br: "Formato de e-mail inválido.",
  },
  E0204: {
    en: "User registration is currently disabled.",
    br: "O registro de usuário está atualmente desativado.",
  },
  E0205: {
    en: "Could not send a verification email. Please try again later.",
    br: "Não foi possível enviar um e-mail de verificação. Por favor, tente novamente mais tarde.",
  },
  E0206: {
    en: "Email must contain '@' and '.'",
    br: 'O e-mail deve conter "@" e "."',
  },
  E0207: {
    en: "Email must be at least 6 characters.",
    br: "O e-mail deve ter pelo menos 6 caracteres.",
  },
  E0208: {
    en: "Email is required.",
    br: "O e-mail é obrigatório.",
  },
  E0209: {
    en: "First and last name are required.",
    br: "O primeiro e último nome são obrigatórios.",
  },
  E0210: {
    en: "Names must be between 1 and 50 characters.",
    br: "Os nomes devem ter entre 1 e 50 caracteres.",
  },
  E0211: {
    en: "Name must only contain letters, spaces, hyphens and apostrophes.",
    br: "O nome deve conter apenas letras, espaços, hifens e apóstrofos.",
  },
  E0212: {
    en: "Password is required.",
    br: "A senha é obrigatória.",
  },
  E0213: {
    en: "Password must be at least 8 characters.",
    br: "A senha deve ter pelo menos 8 caracteres.",
  },
  E0214: {
    en: "Password must contain at least one letter.",
    br: "A senha deve conter pelo menos uma letra.",
  },

  // E03 - Logout errors
  E0301: {
    en: "User is not authenticated. Logout is not possible.",
    br: "O usuário não está autenticado. O logout não é possível.",
  },

  // E04 - Password reset errors
  E0401: {
    en: "The provided email is not associated with any account.",
    br: "O e-mail fornecido não está associado a nenhuma conta.",
  },
  E0402: {
    en: "Password reset link has expired.",
    br: "O link de redefinição de senha expirou.",
  },
  E0403: {
    en: "Password reset link is invalid or has already been used.",
    br: "O link de redefinição de senha é inválido ou já foi utilizado.",
  },
  E0404: {
    en: "Password reset code has expired.",
    br: "O código de redefinição de senha expirou.",
  },
  E0405: {
    en: "Password reset code is invalid or has already been used.",
    br: "O código de redefinição de senha é inválido ou já foi utilizado.",
  },
  E0406: {
    en: "Too many requests. Please try again later.",
    br: "Muitas solicitações. Por favor, tente novamente mais tarde.",
  },

  // E05 - Verification errors
  E0501: {
    en: "Account is already verified.",
    br: "A conta já está verificada.",
  },
  E0502: {
    en: "Verification link has expired.",
    br: "O link de verificação expirou.",
  },
  E0503: {
    en: "Verification link is invalid or has already been used.",
    br: "O link de verificação é inválido ou já foi utilizado.",
  },

  // E06 - Subscription errors
  E0601: {
    en: "Could not subscribe to course",
    br: "Não foi possível se inscrever no curso",
  },
  E0602: {
    en: "Could not unsubscribe to course",
    br: "Não foi possível cancelar a inscrição no curso",
  },
  E0603: {
    en: "Could not get users subscriptions",
    br: "Não foi possível obter as inscrições do usuário",
  },
  E0604: {
    en: "Could not check users subscriptions",
    br: "Não foi possível verificar as inscrições do usuário",
  },
  E0605: {
    en: "Cannot subscribe to course: User is already subscribed to course.",
    br: "Não é possível se inscrever no curso: O usuário já está inscrito no curso.",
  },
  E0606: {
    en: "Cannot unsubscribe from course: User is not subscribed to course.",
    br: "Não é possível cancelar a inscrição no curso: O usuário não está inscrito no curso.",
  },

  // E07 - Point system errors
  E0701: {
    en: "Points added is less than or equal to 0.",
    br: "Os pontos adicionados são menores ou iguais a 0.",
  },
  E0702: {
    en: "Points must be of type integer",
    br: "Os pontos devem ser do tipo inteiro",
  },
  E0703: {
    en: "Points are required.",
    br: "Os pontos são obrigatórios.",
  },
  E0704: {
    en: "Max level reached.",
    br: "Nível máximo atingido.",
  },

  // E08 - Model update errors
  E0801: {
    en: "Attempted to update illegal field name",
    br: "Tentativa de atualizar um nome de campo inválido",
  },
  E0802: {
    en: "Field value is identical to the current value.",
    br: "O valor do campo é idêntico ao valor atual.",
  },
  E0803: {
    en: "Cannot update password directly.",
    br: "Não é possível atualizar a senha diretamente.",
  },
  E0804: {
    en: "Points must be a positive number.",
    br: "Os pontos devem ser um número positivo.",
  },
  E0805: {
    en: "Old and new password required.",
    br: "Senha antiga e nova são obrigatórias.",
  },
  E0806: {
    en: "Old password is incorrect.",
    br: "A senha antiga está incorreta.",
  },

  // E09 - Answer exercise errors
  E0901: {
    en: "This exercise is already in completedExercises.",
    br: "Este exercício já está em exercícios concluídos.",
  },
};
