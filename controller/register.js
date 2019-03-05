const Express = require('express');
const Mysql = require('mysql');
const Eschtml = require('htmlspecialchars');

const Db_host = 'localhost';
const Db_user = 'root';
const Db_password = 'pass';
const Db_name = 'Matcha'
const Connection = Mysql.createConnection({
    host: Db_host,
    user: Db_user,
    password: Db_password,
    database: Db_name
});

const register = (userName2, firstName2, lastName2, password2, confirmedPass2, email2) => {
    return new Promise((resolve, reject) => {
        // check var existence
        if (typeof userName2 === "string" && typeof firstName2 === "string" && typeof lastName2 === "string" &&
            typeof password2 === "string" && typeof confirmedPass2 === "string" && typeof email2 === "string") {

            // check password matching
            if (password2 === confirmedPass2) {

                // var security
                let userName = Eschtml(userName2);
                let firstName = Eschtml(firstName2);
                let lastName = Eschtml(lastName2);
                let pass = Eschtml(password2);
                let email = Eschtml(email2);

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

                if (userNameRgx.test(userName) === false) {
                    reject('invalid userName');
                } else if (nameRgx.test(firstName) === false) {
                    reject(Error('invalid firstName'));
                } else if (nameRgx.test(lastName) === false) {
                    reject(Error('invalid lastName'));
                } else if (passRgx.test(pass) === false) {
                    reject(Error('invalid password'));
                } else if (emailRgx.test(email) === false) {
                    reject(Error('invalid email'));
                } else {
                    Connection.connect((err) => {
                        if (err) throw err;
                        Connection.query("SELECT COUNT(*) AS userNameCount FROM `users` WHERE `userName` = ?", [userName], (err, result) => {
                            if (err) throw err;
                            if (result[0].userNameCount != 0) reject(Error('userName used'));
                            console.log(userName)
                        });
                        Connection.query("SELECT COUNT(*) AS emailCount FROM `users` WHERE `email` = ?", [email], (err, result) => {
                            if (err) throw err;
                            if (result[0].emailCount != 0) reject(Error('userName used'));
                        });
                        resolve(true);
                    })
                }
            } else {
                reject(Error('password and confirmedPass is different'));
            }
        } else {
            reject(Error('missing variable or invalid type'));
        }
    })
}

// A UTILISER POUR CALL FONCTION

register("Mitena", "kevin", "Erbault",
    "Test1234?", "Test1234?", "test@gemail.com").then(toto => {
    console.log(toto)
}).catch(tata => {
    console.log(tata)
})