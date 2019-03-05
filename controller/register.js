const express = require('express');
const mysql = require('mysql');
const eschtml = require('htmlspecialchars');
const bodyParser = require('body-parser');
const mysql_import = require('mysql-import');

const server = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
const db_host = 'localhost';
const db_user = 'root';
const db_password = 'pass';
const db_name = 'Matcha'
const connection = mysql.createConnection({
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_name
});

const register = (userName2, firstName2, lastName2, password2, confirmedPass2, email2) => {
    return new Promise((resolve, reject) => {
        // check var existence
        if (typeof userName2 === "string" && typeof firstName2 === "string" && typeof lastName2 === "string" &&
            typeof password2 === "string" && typeof confirmedPass2 === "string" && typeof email2 === "string") {

            // check password matching
            if (password2 === confirmedPass2) {

                // var security
                let userName = eschtml(userName2),
                    firstName = eschtml(firstName2),
                    lastName = eschtml(lastName2),
                    pass = eschtml(password2),
                    email = eschtml(email2);

                // regex definition
                const userNameRgx = RegExp('^[a-z0-9]{2,50}$', 'i');
                // Minuscule, maj et nombres acceptes, taille de 4 a 25 char

                const nameRgx = /^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]+\.?(([',. -][a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]\.?)?[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]*\.?)*[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]?\.?$/i;
                // Minuscule, maj, nombres et caracteres avec accents acceptes, taille de 2 a 40 char

                const passRgx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
                // between 8 and 50 characters, at least one uppercase letter, one lowercase letter, one number
                // and one special character

                const emailRgx = /^[a-z0-9._%+-]{1,64}@[a-z0-9._-]+\.[a-z]{2,255}$/i;
                // Minuscule, maj et nombres acceptes, taille de 4 a 25 char


                // testing regex

                if (userNameRgx.test(userName) === true) {
                    if (nameRgx.test(firstName) === true) {
                        if (nameRgx.test(lastName) === true) {
                            if (passRgx.test(pass) === true) {
                                if (emailRgx.test(email) === true) {
                                    connection.connect((err) => {
                                        if (err) throw err;
                                        connection.query("SELECT COUNT(*) AS `userNameCount` FROM `users` WHERE `userName` = ?", [userName], (err, result) => {
                                            if (err) throw err;
                                            if (result[0].userNameCount != 0) reject(Error('userName used'));

                                        });
                                        connection.query("SELECT COUNT(*) AS `emailCount` FROM `users` WHERE `email` = ?", [email], (err, result) => {
                                            if (err) throw err;
                                            if (result[0].emailCount != 0) reject(Error('userName used'));
                                        });
                                        resolve(true);
                                    })
                                } else {
                                    reject(Error('invalid email'));
                                }
                            } else {
                                reject(Error('invalid password'));
                            }
                        } else {
                            reject(Error('invalid lastName'));
                        }
                    } else {
                        reject(Error('invalid firstName'));
                    }
                } else {
                    reject('invalid userName');
                }
            }
        } else {
            reject(Error('missing var or invalid type'));
        }
    })
}

// A UTILISER POUR CALL FONCTION

register("mitena", "kevin", "Erbault",
    "Test1234?", "Test1234?", "test@gemail.com").then(toto => {
    console.log(toto)
}).catch(tata => {
    console.log(tata)
})