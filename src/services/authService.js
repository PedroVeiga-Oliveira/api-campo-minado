const authRepository = require('../repositories/authRepository');

class AuthService {
  validatePassword(senha) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(senha);
  }

  async register({ nome, email, dataNascimento, senha, confirmacaoSenha }) {
    if (!nome || !email || !dataNascimento || !senha || !confirmacaoSenha) {
      throw new Error('Todos os campos são obrigatórios.');
    }
    if (senha !== confirmacaoSenha) {
      throw new Error('A senha e a confirmação de senha não coincidem.');
    }
    if (!this.validatePassword(senha)) {
      throw new Error('A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial.');
    }
    const userExists = await authRepository.findByEmail(email);
    if (userExists) {
      throw new Error('E-mail já cadastrado.');
    }
    return await authRepository.create({ nome, email, dataNascimento, senha });
  }

  async login(email, senha) {
    if (!email || !senha) throw new Error('E-mail e senha são obrigatórios.');
    const user = await authRepository.findByEmail(email);
    if (!user || user.senha !== senha) {
      throw new Error('Credenciais inválidas.');
    }
    return { id: user.id, nome: user.nome, email: user.email, dataNascimento: user.data_nascimento };
  }

  async resetPassword(id, novaSenha) {
    if (!id || !novaSenha) throw new Error('ID e nova senha são obrigatórios.');
    if (!this.validatePassword(novaSenha)) {
      throw new Error('A nova senha não cumpre os requisitos mínimos.');
    }
    const user = await authRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado.');
    if (user.senha === novaSenha) {
      throw new Error('A nova senha não pode ser igual à senha atual.');
    }
    await authRepository.updatePassword(id, novaSenha);
  }
}

module.exports = new AuthService();