const pool = require('../config/db');

class GameRepository {
  async findActiveGameByUserId(idUser) {
    const res = await pool.query(
      "SELECT * FROM jogos WHERE id_user = $1 AND status = 'EM_ANDAMENTO'",
      [idUser]
    );
    return res.rows[0];
  }

  async findGameById(gameId) {
    const res = await pool.query('SELECT * FROM jogos WHERE id = $1', [gameId]);
    return res.rows[0];
  }

  async createGame(idUser, valorAposta, tabuleiro, posicoesReveladas) {
    const res = await pool.query(
      "INSERT INTO jogos (id_user, valor_aposta, tabuleiro, posicoes_reveladas, status) VALUES ($1, $2, $3, $4, 'EM_ANDAMENTO') RETURNING id",
      [idUser, valorAposta, tabuleiro, posicoesReveladas]
    );
    return res.rows[0].id;
  }

  async updateGameProgress(gameId, posicoesReveladas, diamantesEncontrados, premioAtual, status) {
    await pool.query(
      'UPDATE jogos SET posicoes_reveladas = $1, diamantes_encontrados = $2, premio_atual = $3, status = $4 WHERE id = $5',
      [posicoesReveladas, diamantesEncontrados, premioAtual, status, gameId]
    );
  }
}

module.exports = new GameRepository();