const express = require('express');
const router = express.Router();
const db = require('../db');

/* ===== ADD: validação de nome ===== */
function validarNome(nome) {
  if (!nome) return 'nome é obrigatório';
  if (nome.length > 50) return 'nome deve ter no máximo 50 caracteres';
  return null;
}
// ===== FIM ADD =====


// GET /api/users - listar todos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nome, email, telefone FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// GET /api/users/:id - obter por id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nome, email, telefone FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// POST /api/users - criar
router.post('/', async (req, res) => {
  const { nome, email, telefone } = req.body;

  /* ===== ADD: validação ===== */
  const erroNome = validarNome(nome);
  if (erroNome) {
    return res.status(400).json({ error: erroNome });
  }
  /* ===== FIM ADD ===== */

  if (!nome || !email) return res.status(400).json({ error: 'nome e email são obrigatórios' });
  try {
    const [result] = await db.query(
      'INSERT INTO users (nome, email, telefone) VALUES (?, ?, ?)',
      [nome, email, telefone || null]
    );
    const inserted = { id: result.insertId, nome, email, telefone };
    res.status(201).json(inserted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// PUT /api/users/:id - atualizar
router.put('/:id', async (req, res) => {
  const { nome, email, telefone } = req.body;

  /* ===== ADD: validação ===== */
  const erroNome = validarNome(nome);
  if (erroNome) {
    return res.status(400).json({ error: erroNome });
  }
  /* ===== FIM ADD ===== */

  try {
    const [result] = await db.query(
      'UPDATE users SET nome = ?, email = ?, telefone = ? WHERE id = ?',
      [nome, email, telefone, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ id: Number(req.params.id), nome, email, telefone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// DELETE /api/users/:id - remover
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});

module.exports = router;
