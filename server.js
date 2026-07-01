require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 }, // 8 h
}));

const indexRouter  = require('./src/routes/index');
const adminRouter  = require('./src/routes/admin');
//const { startPolling } = require('./src/services/liveScores');
app.use('/', indexRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n⚽  Porra Mundial 2026 corriendo en http://localhost:${PORT}\n`);
//  startPolling();
});
