import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SALT_ROUNDS = 10;
const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')))
const port = process.env.PORT || 3000; // Use the provided PORT environment variable or default to 3000

(async () => {
  // Connect to your internal Redis instance using the REDIS_URL environment variable
  // The REDIS_URL is set to the internal Redis URL e.g. redis://red-343245ndffg023:6379
  const redis = createClient({
      url: process.env.REDIS_URL
  });

  const getUsers = async () => {
    const users = await redis.get('users')
    return users ? JSON.parse(users) : []
  }

  const updateUsers = async (users) => {
    await redis.set('users', JSON.stringify(users))
  }

  const getUsernames = (users) => {
    return users.map(({username}) => username)
  }

  redis.on('error', (err) => console.log('Redis Client Error', err));

  await redis.connect();

  // Send and retrieve some values
  // await client.set('key', 'node redis');
  // const value = await client.get('key');

  app.post('/login', async (req, res) => {
    const { username, password, authToken } = req.body;
  
    const users = await getUsers()

    if (authToken) {
      const username = await redis.get(`auth:${authToken}`);
      if (username) {
        const users = await getUsers()
        return res.status(200).json({ message: 'Valid token', username, users: getUsernames(users) });
      } else {
        return res.status(404).json({ message: 'Invalid token' });
      }
    }

    // Check if the user exists
    const user = users.find((u) => u.username === username);
  
    if (!user && username && password) {
      console.log(`New user signing up: ${username}`);
      const user = {
        username,
        hashedPassword: bcrypt.hashSync(password, SALT_ROUNDS),
        loginAttempts: 0,
      }
      users.push(user)
      updateUsers(users);

      return res.status(201).json({ message: `User created: ${username}` });
    }

    if (user.loginAttempts >= 3) {
      return res.status(429).json({ message: 'Too many attempts' });
    }
  
    if (!bcrypt.compareSync(password, user.hashedPassword)) {
      user.loginAttempts++
      updateUsers(users);

      return res.status(401).json({ message: 'Wrong password', attempts: 3 - user.loginAttempts });
    }
  
    const token = crypto.randomBytes(32).toString('hex');
    
    // Store the authentication token in Redis
    redis.set(`auth:${token}`, username);
    
    res.json({ authToken: token, username, users: getUsernames(users) });
  });

  app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
