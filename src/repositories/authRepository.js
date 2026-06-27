const pool = require('../config/db');

class AuthRepository {
  async findByEmail(email) {
    const res = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return res.rows[0];
  }

  async findById(id) {
    const res = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return res.rows[0];
  }

  async create({ nome, email, dataNascimento, senha }) {
    const res = await pool.query(
      'INSERT INTO usuarios (nome, email, data_nascimento, senha) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, data_nascimento as "dataNascimento"',
      [nome, email, dataNascimento, senha]
    );
    return res.rows[0];
  }

  async updatePassword(id, novaSenha) {
    await pool.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [novaSenha, id]);
  }
}

module.exports = new AuthRepository();