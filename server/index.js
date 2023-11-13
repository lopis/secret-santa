import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createClient } from 'redis';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import kebabCase from 'lodash/kebabCase.js';
import assign from './assign.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SALT_ROUNDS = 10;
const app = express();
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
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

  const getUser = async (username, users) => {
    return users.find(user => user.username == username)
  }

  const getUserData = ({name, secretFriend, helper}) => {
    return { name, secretFriend, helper }
  }

  const updateUsers = async (users) => {
    await redis.set('users', JSON.stringify(users))
  }

  const getUserNames = (users) => {
    return users.map(({name}) => name)
  }

  const cleanupName = (name) => {
    return kebabCase(name.trim())
  }

  redis.on('error', (err) => console.log('Redis Client Error', err));

  await redis.connect();

  // Send and retrieve some values
  // await client.set('key', 'node redis');
  // const value = await client.get('key');

  app.post('/login', async (req, res) => {
    let { username: name, password, authToken } = req.body;

    if (name) {
      name = name.trim()
    }
    const username = kebabCase(name)
  
    const users = await getUsers()

    if (authToken) {
      const username = await redis.get(`auth:${authToken}`);

      if (username === 'admin') {
        return res.json({
          message: `Admin access granted`,
          authToken,
          user: { name: username },
          users: getUserNames(users)
        })
      }

      const user = await getUser(username, users);
      if (username && user) {
          return res.status(200).json({
            message: 'Valid token',
            user: getUserData(user),
            users: getUserNames(users)
          });
      } else {
        return res.status(401).json({ message: 'Sessão expirou' });
      }
    }

    if (!username || !password) {
      return res.status(400).json({ message: `Password ou nome em falta` });
    }

    if (username === 'admin') {
      if (password === process.env.ADMIN_PWD) {
        const token = crypto.randomBytes(32).toString('hex')
        redis.set(`auth:${token}`, username)
        const status = await redis.get('status')
  
        return res.json({
          message: `Admin access granted`,
          authToken: token,
          user: { name: username, status },
          users: getUserNames(users),
        })
      } else {
        return res.status(401).json({ message: 'Password incorreta' });
      }
    }

    // Check if the user exists
    const user = users.find((u) => u.username === username);
  
    if (!user && username && password) {
      // NEW USER
      const status = await redis.get('status')
      if (status === 'started') {
        return res.status(401).json({message: 'Utilizador não existe.'})
      }

      console.log(`New user signing up: ${username}`);
      const user = {
        username,
        name,
        hashedPassword: bcrypt.hashSync(password, SALT_ROUNDS),
        loginAttempts: 0,
      }
      users.push(user)
      updateUsers(users);
      const token = crypto.randomBytes(32).toString('hex');
      redis.set(`auth:${token}`, username);
      return res.status(201).json({
        message: `User created: ${username}`,
        authToken: token,
        user: getUserData(user),
        users: getUserNames(users),
      });
    }

    if (user.loginAttempts >= 5) {
      return res.status(429).json({ message: 'Demasiadas tentativas' });
    }
  
    // User pwd has been reset
    if(user.hashedPassword == "") {
      user.hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
      updateUsers(users);
    }

    if (!bcrypt.compareSync(password, user.hashedPassword)) {
      user.loginAttempts++
      updateUsers(users);

      return res.status(401).json({ message: 'Password incorreta', attempts: 3 - user.loginAttempts });
    }
  
    const token = crypto.randomBytes(32).toString('hex');
    redis.set(`auth:${token}`, username);
    
    res.json({ authToken: token, user: getUserData(user), users: getUserNames(users) });
  });

  app.get('/assign', async (req, res) => {
    let { authToken } = req.cookies;
    if (authToken) {
      const admin = await redis.get(`auth:${authToken}`);
      if (admin === 'admin') {
        await redis.set('status', 'started')
        const users = await getUsers()
        assign(users);
        updateUsers(users);
        return res.status(200).send();
      }
    }

    return res.status(401).json({ message: 'Sessão expirou'})
  })

  app.get('/reset', async (req, res) => {
    let { authToken } = req.cookies;
    if (authToken) {
      const admin = await redis.get(`auth:${authToken}`);
      if (admin === 'admin') {
        const username = cleanupName(req.query.username)
        const users = await getUsers()
        const user = await getUser(username, users);
        user.hashedPassword = ''
        user.loginAttempts = 0
        updateUsers(users);
        return res.status(200).send({message: 'Password reset'});
      }
    }

    return res.status(401).json({ message: 'Sessão expirou'})
  })

  app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
