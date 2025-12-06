const path = require('path');
const express = require('express');
const multer = require('multer');
const file_utils = require('./utils/file_utils');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');


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


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(33333);
