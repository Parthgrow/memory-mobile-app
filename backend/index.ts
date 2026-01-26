import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { randomUUID } from 'crypto';
import { getKVClient } from './lib/kv.js';
import {
  hashPassword,
  comparePassword,
  validateEmail,
  validatePassword,
  generateToken,
  verifyToken,
  getUserFromAuthHeader,
  type User,
} from './lib/auth.js';
import type { DailyScore, MonthlySummary } from './lib/types/score.js';

const app = new Hono();

// CORS middleware
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (c.req.method === 'OPTIONS') {
    return c.newResponse(null, { status: 204 });
  }
  await next();
});

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// Register endpoint
app.post('/api/register', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    if (!validateEmail(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }

    if (!validatePassword(password)) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }

    const kv = getKVClient();
    const userKey = `memory:user:${email.toLowerCase()}`;

    // Check if user already exists
    const existingUser = await kv.get<User>(userKey);
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate userId
    const userId = randomUUID();

    // Store user
    const user: User = {
      userId,
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    await kv.set(userKey, user);

    // Generate token
    const token = generateToken(user.email);

    return c.json({
      token,
      user: {
        userId: user.userId,
        email: user.email,
      },
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Login endpoint
app.post('/api/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    if (!validateEmail(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }

    const kv = getKVClient();
    const userKey = `memory:user:${email.toLowerCase()}`;

    // Get user from KV
    const user = await kv.get<User>(userKey);
    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Generate token
    const token = generateToken(user.email);

    return c.json({
      token,
      user: {
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Verify endpoint
app.post('/api/verify', async (c) => {
  try {
    const body = await c.req.json();
    const { token } = body;

    if (!token) {
      return c.json({ error: 'Token is required' }, 400);
    }

    // Verify token
    const decoded = verifyToken(token);

    return c.json({
      valid: true,
      user: {
        email: decoded.email,
      },
    });
  } catch (error) {
    return c.json({
      valid: false,
      error: 'Invalid or expired token',
    }, 401);
  }
});

// POST /api/scores - Record session score
app.post('/api/scores', async (c) => {
  try {

    console.log("[scores] endpoint was called"); 
    const authHeader = c.req.header('Authorization');
    const user = await getUserFromAuthHeader(authHeader, getKVClient);

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { score, date } = body;

    if (typeof score !== 'number') {
      return c.json({ error: 'Score is required' }, 400);
    }

    const practiceDate = date || new Date().toISOString().split('T')[0];
    const kv = getKVClient();
    const dailyKey = `memory:score:${user.userId}:${practiceDate}`;

    // Get existing score
    const existing = await kv.get<DailyScore>(dailyKey);

    // Only update if score is higher
    if (existing && score <= existing.highestScore) {
      return c.json({ success: true, updated: false });
    }

    // Update daily score
    const dailyScore: DailyScore = {
      date: practiceDate,
      highestScore: score,
      updatedAt: Date.now(),
    };
    await kv.set(dailyKey, dailyScore);

    // Update monthly index if first score of day
    if (!existing) {
      const month = practiceDate.substring(0, 7); // YYYY-MM
      const indexKey = `memory:score-index:${user.userId}:${month}`;
      const existingIndex = await kv.get<string[]>(indexKey) || [];
      await kv.set(indexKey, [...existingIndex, practiceDate]);
    }

    return c.json({ success: true, updated: true });
  } catch (error) {
    console.error('Score save error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/scores/daily/:date - Get daily score
app.get('/api/scores/daily/:date', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await getUserFromAuthHeader(authHeader, getKVClient);

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const date = c.req.param('date');
    const kv = getKVClient();
    const dailyKey = `memory:score:${user.userId}:${date}`;

    const dailyScore = await kv.get<DailyScore>(dailyKey);
    return c.json(dailyScore || null);
  } catch (error) {
    console.error('Daily score fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/scores/monthly/:month - Get monthly summary
app.get('/api/scores/monthly/:month', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await getUserFromAuthHeader(authHeader, getKVClient);

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const month = c.req.param('month'); // YYYY-MM
    const kv = getKVClient();

    // Get monthly index
    const indexKey = `memory:score-index:${user.userId}:${month}`;
    const dates = await kv.get<string[]>(indexKey) || [];

    if (dates.length === 0) {
      return c.json({
        month,
        practiceDays: 0,
        bestScore: 0,
        averageScore: 0,
        dailyScores: [],
      });
    }

    // Fetch all daily scores
    const dailyScores = await Promise.all(
      dates.map(date =>
        kv.get<DailyScore>(`memory:score:${user.userId}:${date}`)
      )
    );

    const validScores = dailyScores.filter(
      (score): score is DailyScore => score !== null
    );

    // Compute summary
    const bestScore = Math.max(...validScores.map(s => s.highestScore), 0);
    const averageScore = validScores.length > 0
      ? validScores.reduce((sum, s) => sum + s.highestScore, 0) / validScores.length
      : 0;

    return c.json({
      month,
      practiceDays: validScores.length,
      bestScore,
      averageScore: Math.round(averageScore * 100) / 100,
      dailyScores: validScores,
    });
  } catch (error) {
    console.error('Monthly summary error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});


const port = 8001
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
})
export default app; 