const path = require('path');
const express = require('express');
const multer = require('multer');
const file_utils = require('./utils/file_utils');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://127.0.0.1:27017/pb_2025_41K8_lipiec';

const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('tiny-csrf');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  multer({ storage: file_utils.fileStorage, 
           fileFilter: file_utils.fileFilter }
  ).single("image")
);

app.use(cookieParser("our-very-unique-and-secret-cookie-parser-string"));

app.use(
  session({
    secret: 'our-very-unique-and-secret-session-string',
    resave: false,
    saveUninitialized: false,
    store: store})
  );

app.use(
  csrf('this_should_be_32_character_long', ['POST','DELETE', 'PUT', 'PATCH'], ["/logout", /\/product(\/.*)?/i]));

app.use((req, res, next) => {
  res.locals.myToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
app.use(errorController.get500);

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {});
    app.listen(33333, () => {
      console.log('Connected to MongoDB and server is running on port 33333');
    });
  } catch (err) {
    console.error(err);
  }
})();
