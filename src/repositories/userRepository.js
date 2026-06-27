const pool = require('../config/db');

class UserRepository {
  async findById(id) {
    const res = await pool.query('SELECT id, nome, email, saldo FROM usuarios WHERE id = $1', [id]);
    return res.rows[0];
  }

  async updateSaldo(id, novoSaldo) {
    await pool.query('UPDATE usuarios SET saldo = $1 WHERE id = $2', [novoSaldo, id]);
  }

  async delete(id) {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  }

  async getDashboardStats(id) {
    const totalJogos = await pool.query('SELECT COUNT(*) FROM jogos WHERE id_user = $1', [id]);
    const vitorias = await pool.query("SELECT COUNT(*) FROM jogos WHERE id_user = $1 AND status = 'GANHO'", [id]);
    const derrotas = await pool.query("SELECT COUNT(*) FROM jogos WHERE id_user = $1 AND status = 'PERDIDO'", [id]);
    
    const ganhos = await pool.query("SELECT SUM(premio_atual - valor_aposta) FROM jogos WHERE id_user = $1 AND status = 'GANHO'", [id]);
    const perdidos = await pool.query("SELECT SUM(valor_aposta) FROM jogos WHERE id_user = $1 AND status = 'PERDIDO'", [id]);

    return {
      totalJogos: parseInt(totalJogos.rows[0].count) || 0,
      vitorias: parseInt(vitorias.rows[0].count) || 0,
      derrotas: parseInt(derrotas.rows[0].count) || 0,
      valorGanho: parseFloat(ganhos.rows[0].sum) || 0.00,
      valorPerdido: parseFloat(perdidos.rows[0].sum) || 0.00
    };
  }
}

module.exports = new UserRepository();