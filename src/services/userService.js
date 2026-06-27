const userRepository = require('../repositories/userRepository');

class UserService {
  async getUser(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado.');
    return { ...user, saldo: parseFloat(user.saldo) };
  }

  async addSaldo(id, saldoInput) {
    if (saldoInput < 0) throw new Error('Não é permitido cadastrar saldo negativo.');
    const user = await userRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado.');
    
    const saldoFormatado = parseFloat(parseFloat(saldoInput).toFixed(2));
    const novoSaldo = parseFloat(user.saldo) + saldoFormatado;
    await userRepository.updateSaldo(id, novoSaldo);
    return { msg: "Saldo adicionado com sucesso" };
  }

  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado.');
    await userRepository.delete(id);
  }

  async getDashboard(id) {
    return await userRepository.getDashboardStats(id);
  }
}

module.exports = new UserService();