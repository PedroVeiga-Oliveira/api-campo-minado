const gameRepository = require('../repositories/gameRepository');
const userRepository = require('../repositories/userRepository');

class GameService {
  generateBoard() {
    let flatBoard = Array(5).fill('BOMBA').concat(Array(20).fill('DIAMANTE'));
    flatBoard.sort(() => Math.random() - 0.5);

    let board = [];
    for (let i = 0; i < 5; i++) {
      board.push(flatBoard.slice(i * 5, i * 5 + 5));
    }
    return board;
  }

  generateEmptyRevealedMatrix() {
    return Array(5).fill(null).map(() => Array(5).fill('false'));
  }

  async startGame(idUser, valorAposta) {
    const user = await userRepository.findById(idUser);
    if (!user) throw new Error('Usuário não encontrado.');
    if (parseFloat(user.saldo) < valorAposta) throw new Error('Saldo insuficiente.');

    const activeGame = await gameRepository.findActiveGameByUserId(idUser);
    if (activeGame) throw new Error('Usuário já possui uma partida em andamento.');

    const novoSaldo = parseFloat(user.saldo) - valorAposta;
    await userRepository.updateSaldo(idUser, novoSaldo);

    const tabuleiro = this.generateBoard();
    const posicoesReveladas = this.generateEmptyRevealedMatrix();

    const gameId = await gameRepository.createGame(idUser, valorAposta, tabuleiro, posicoesReveladas);
    return { gameId };
  }

  async revealPosition(gameId, linha, column) {
    const game = await gameRepository.findGameById(gameId);
    if (!game) throw new Error('Partida não encontrada.');
    if (game.status !== 'EM_ANDAMENTO') throw new Error('Esta partida já foi encerrada.');

    if (game.posicoes_reveladas[linha][column] === 'true') {
      throw new Error('Esta posição já foi escolhida anteriormente. Escolha outra.');
    }

    game.posicoes_reveladas[linha][column] = 'true';
    const elemento = game.tabuleiro[linha][column];

    if (elemento === 'BOMBA') {
      await gameRepository.updateGameProgress(gameId, game.posicoes_reveladas, game.diamantes_encontrados, 0, 'PERDIDO');
      return { resultado: 'BOMBA', status: 'PERDIDO' };
    } else {
      const novosDiamantes = game.diamantes_encontrados + 1;
      const novoPremio = parseFloat(game.valor_aposta) * (1 + (novosDiamantes * 0.33));
      
      await gameRepository.updateGameProgress(gameId, game.posicoes_reveladas, novosDiamantes, novoPremio, 'EM_ANDAMENTO');
      
      return {
        resultado: 'DIAMANTE',
        diamantesEncontrados: novosDiamantes,
        premioAtual: parseFloat(novoPremio.toFixed(2))
      };
    }
  }

  async cashout(gameId) {
    const game = await gameRepository.findGameById(gameId);
    if (!game) throw new Error('Partida não encontrada.');
    if (game.status !== 'EM_ANDAMENTO') throw new Error('Esta partida já foi encerrada.');
    if (game.diamantes_encontrados === 0) throw new Error('Você precisa encontrar pelo menos um diamante para realizar o cashout.');

    await gameRepository.updateGameProgress(game.id, game.posicoes_reveladas, game.diamantes_encontrados, game.premio_atual, 'GANHO');

    const user = await userRepository.findById(game.id_user);
    const novoSaldo = parseFloat(user.saldo) + parseFloat(game.premio_atual);
    await userRepository.updateSaldo(game.id_user, novoSaldo);

    return { message: 'Cashout realizado com sucesso.', valorGanho: parseFloat(game.premio_atual) };
  }
}

module.exports = new GameService();