const gameService = require('../services/gameService');

class GameController {
  async start(req, res) {
    try {
      const { idUser, valorAposta } = req.body;
      const result = await gameService.startGame(idUser, valorAposta);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async reveal(req, res) {
    try {
      const { gameId } = req.params;
      const { linha, coluna } = req.body;
      const result = await gameService.revealPosition(gameId, linha, coluna);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async cashout(req, res) {
    try {
      const { gameId } = req.params;
      const result = await gameService.cashout(gameId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new GameController();