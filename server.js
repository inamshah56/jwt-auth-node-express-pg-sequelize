const express = require('express');
const cors = require('cors');
const network = require('network');
const { sequelize } = require('./utils/db');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const blacklistTokenRoutes = require('./routes/blacklistTokenRoute')

// global middlewares 
const app = express();
const corsOptions = {
  origin: 'https://localhost:8000',
};

app.use(express.json());
app.use(cors(corsOptions));
const PORT = process.env.PORT || 8000;

// db connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('----- Connection established successfully -----');
    await sequelize.sync();
    console.log('----- All models were synchronized successfully -----');
  } catch (err) {
    console.error('----- Unable to connect to the database -----', err);
  }
};

connectDB();

// get local ip address
const getLocalIpAddress = () => {
  return new Promise((resolve, reject) => {
    network.get_private_ip((err, ip) => {
      if (err) {
        reject(err);
      } else {
        resolve(ip);
      }
    });
  });
};

// routes
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the JWT based Authentication' });
});
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/blacklist-token', blacklistTokenRoutes)


const startServer = async () => {
  try {
    const ipAddress = await getLocalIpAddress();
    app.listen(PORT, () =>
      console.log(` ----- Server running on http://${ipAddress}:${PORT} ----- `)
    );
  } catch (error) {
    console.error('Error:', error.message);
  }
};

startServer();
