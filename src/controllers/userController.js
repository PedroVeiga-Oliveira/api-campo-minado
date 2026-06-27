const userService = require('../services/userService');

class UserController {
  async getUser(req, res) {
    try {
      const user = await userService.getUser(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  async addSaldo(req, res) {
    try {
      const { saldo } = req.body;
      await userService.addSaldo(req.params.id, saldo);
      return res.status(200).json({ message: 'Saldo atualizado com sucesso.' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      return res.status(200).json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getDashboard(req, res) {
    try {
      const userId = req.query.id || 1; 
      const stats = await userService.getDashboard(userId); 
      return res.status(200).json(stats);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UserController();