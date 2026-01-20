import 'dotenv/config';
import { Hono } from 'hono'; 
import {serve} from '@hono/node-server';
import { randomUUID } from 'crypto';
import { getKVClient } from './lib/kv.js';
import {
  hashPassword,
  comparePassword,
  validateEmail,
  validatePassword,
  generateToken,
  verifyToken,
  type User,
} from './lib/auth.js';

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

app.get('/', (c)=>{
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


const port = 8001
console.log(`Server is running on port ${port}`); 

serve({
    fetch : app.fetch,
    port
})
export default app ; 