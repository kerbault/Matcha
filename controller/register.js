const Mysql = require('mysql');
const Eschtml = require('htmlspecialchars');
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');

const Db_host = 'localhost';
const Db_user = 'root';
const Db_password = 'pass';
const Db_name = 'Matcha';
const Connection = Mysql.createConnection({
    host: Db_host,
    user: Db_user,
    password: Db_password,
    database: Db_name
});

const register = (userNameNsfw, firstNameNsfw, lastNameNsfw, passwordNsfw, confirmedPassNsfw, emailNsfw) => {
    return new Promise((resolve, reject) => {
        if (typeof userNameNsfw !== "string" && typeof firstNameNsfw !== "string" && typeof lastNameNsfw !== "string" &&
            typeof passwordNsfw !== "string" && typeof confirmedPassNsfw !== "string" && typeof emailNsfw !== "string") {
            reject({1: 'missing variable or invalid type'});
        } else if (passwordNsfw !== confirmedPassNsfw) {
            reject({2: 'password and confirmedPass is different'});
        } else {

            // var security
            let userName = Eschtml(userNameNsfw);
            let firstName = Eschtml(firstNameNsfw);
            let lastName = Eschtml(lastNameNsfw);
            let passTmp = Eschtml(passwordNsfw);
            let email = Eschtml(emailNsfw);

            // regex definition
            const userNameRgx = /^[a-z0-9]{2,50}$/i;
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
                reject({3: 'invalid userName'});
            } else if (nameRgx.test(firstName) === false) {
                reject({4: 'invalid firstName'});
            } else if (nameRgx.test(lastName) === false) {
                reject({5: 'invalid lastName'});
            } else if (passRgx.test(passTmp) === false) {
                reject({6: 'invalid password'});
            } else if (emailRgx.test(email) === false) {
                reject({7: 'invalid email'});
            } else {
                Connection.connect(null, (err) => {
                    if (err) reject(err);
                    const P1 = new Promise((resolve, reject) => {
                            Connection.query("SELECT COUNT(*) AS userCount FROM `users` WHERE `userName` = ?", [userName], (err, result) => {
                                if (err) reject(err);
                                if (result[0].userCount != 0) reject({8: 'userName and/or email already used'});
                                else resolve(true);
                            })
                        }
                    );
                    const P2 = new Promise((resolve, reject) => {
                            Connection.query("SELECT COUNT(*) AS emailCount FROM `users` WHERE `email` = ?", [email], (err, result) => {
                                if (err) throw err;
                                if (result[0].emailCount != 0) reject({9: 'email already used'});
                                else resolve(true);
                            })
                        }
                    );
                    Promise.all([P1, P2])
                        .then(() => {
                            let pass = bcrypt.hashSync(passTmp, 10);
                            let validKey = uuidv1();
                            Connection.query("INSERT INTO `users` SET `userName` = ?, `password` =?,`lastName`=?, `firstName`=?,`email`=?,`validKey`=?",
                                [userName, pass, lastName, firstName, email, validKey], (err, result) => {
                                    if (err) throw err;
                                    else resolve(true);
                                })
                            resolve({0: true});
                        })
                        .catch(error => {
                            reject(error);
                        })
                })
            }
        }
    })
}

// A UTILISER POUR CALL FONCTION

register("Mitena", "kevin", "Erbault",
    "Test1234?", "Test1234?", "test@gmail.com").then(toto => {
    console.log(toto)
}).catch(tata => {
    console.log(tata)
})