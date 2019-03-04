//╔═════════════════════════════════════════════════════════════════╗
//║ 						required modules						║
//╚═════════════════════════════════════════════════════════════════╝

const express = require('express');
const mysql = require('mysql');
const eschtml = require('htmlspecialchars');
const bodyParser = require('body-parser');
const mysql_import = require('mysql-import');

//╔═════════════════════════════════════════════════════════════════╗
//║ 						server basics							║
//╚═════════════════════════════════════════════════════════════════╝

const server = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
const db_host = 'localhost';
const db_user = 'root';
const db_password = 'pass';
const connection = mysql.createConnection({
    host: db_host,
    user: db_user,
    password: db_password,
});
server.listen(8008)

//╔═════════════════════════════════════════════════════════════════╗
//║ 							create DB							║
//╚═════════════════════════════════════════════════════════════════╝

mysql_import.config({
    host: db_host,
    user: db_user,
    password: db_password,
    database: '',
    onerror: err => console.log(err.message)
}).import('Matcha.sql').then(() => {
    console.log('Database operational')
});

connection.query('CREATE DATABASE IF NOT EXISTS `Matcha`', null, function (err, res) {
    if (err) throw err;
    if (res.warningCount === 0) {
        console.log('Database created');
    }
});

// connection.connect();
//
// connection.query('USE `Matcha`', null, function (err) {
// 	if (err) throw err;
// 	console.log('Database selected');
// });
// connection.query('CREATE TABLE IF NOT EXISTS `users` (' +
// 				 '`ID` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, ' +
// 				 '`userName` VARCHAR(50) NOT NULL,' +
// 				 '`password` VARCHAR(50) NOT NULL,' +
// 				 '`lastName` VARCHAR(50) NOT NULL,' +
// 				 '`firstName` VARCHAR(50) NOT NULL,' +
// 				 '`email` VARCHAR(255) NOT NULL,' +
// 				 '`birthDate` DATE,' +
// 				 '`gender` INT(2),' +
// 				 '`orientation` VARCHAR(50),' +
// 				 '`shortBio` VARCHAR(50),' +
// 				 '`profilePictureID` VARCHAR(50),' +
// 				 '`validKey` VARCHAR(50),' +
// 				 '`userStatus` INT(2),' +
// 				 '`online` INT(2))',
// 				 null, function (err) {
// 		if (err) throw err;
// 		console.log('Users table created');
// 	});
//
// connection.end();

//╔═════════════════════════════════════════════════════════════════╗
//║ 							roots								║
//╚═════════════════════════════════════════════════════════════════╝

server.get('/home', function (req, res) {
    res.render('helloWorld.ejs');
});

/* On ajoute un élément à la todolist */
server.post('/register', urlencodedParser, function (req, res) {
    console.log('welcome POST register');
});

/* Supprime un élément de la todolist */
server.get('/register/:id', function (req, res) {
    console.log('welcome GET register '.id);
});

/* On redirige vers la todolist si la page demandée n'est pas trouvée */
server.use(function (req, res, next) {
    res.redirect('/home');
});