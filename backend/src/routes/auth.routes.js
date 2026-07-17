import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createDbClient } from '../db/client.js';

export const authRoutes = express.Router();

authRoutes.post('/login', async (req, res, next) => {
  const client = createDbClient();
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '').trim();

    if (!normalizedEmail || !normalizedPassword) {
      return res.status(400).json({ message: 'Informe e-mail e senha.' });
    }

    await client.connect();
    const result = await client.query('SELECT id, name, email, role, password_hash FROM users WHERE email = $1', [normalizedEmail]);
    const user = result.rows[0];

    if (!user || !bcrypt.compareSync(normalizedPassword, user.password_hash)) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secult_secret', { expiresIn: '8h' });
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.json({ user: safeUser, token, message: 'Login realizado com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await client.end().catch(() => {});
  }
});

authRoutes.post('/register', async (req, res, next) => {
  const client = createDbClient();
  try {
    const { name = '', email = '', password = '' } = req.body || {};
    const normalizedName = String(name).trim();
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPassword = String(password).trim();

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
    }

    await client.connect();
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rowCount) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    const passwordHash = bcrypt.hashSync(normalizedPassword, 10);
    const inserted = await client.query(
      'INSERT INTO users (name, email, role, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [normalizedName, normalizedEmail, 'user', passwordHash]
    );

    const user = inserted.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secult_secret', { expiresIn: '8h' });
    res.status(201).json({ user, token, message: 'Cadastro realizado com sucesso.' });
  } catch (error) {
    next(error);
  } finally {
    await client.end().catch(() => {});
  }
});
