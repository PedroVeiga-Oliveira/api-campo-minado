const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const user = await authService.login(email, senha);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { id, novaSenha } = req.body;
      await authService.resetPassword(id, novaSenha);
      return res.status(200).json({ message: 'Senha atualizada com sucesso.' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();