const register = (userName, firstName, lastName, password, confirmedPass, mail) => {
    return new Promise((resolve, reject) => {
        // // check var existence
        if (typeof userName === "string" && typeof firstName === "string" && typeof lastName === "string" &&
            typeof password === "string" && typeof confirmedPass === "string" && typeof mail === "string") {

            // check password matching
            if (req.body.pass === req.body.confirmpass) {

                // var security
                let userName = eschtml(userName),
                    firstName = eschtml(firstName),
                    lastName = eschtml(lastName),
                    pass = eschtml(password),
                    mail = eschtml(mail);

                // regex definition
                const userNameRgx = /^[a-z0-9]{2,50}$/i;
                // Minuscule, maj et nombres acceptes, taille de 4 a 25 char

                const nameRgx = /^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]+\.?(([',. -][a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]\.?)?[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]*\.?)*[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]?\.?$/i;
                // Minuscule, maj, nombres et caracteres avec accents acceptes, taille de 2 a 40 char

                const passRgx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
                // between 8 and 50 characters, at least one uppercase letter, one lowercase letter, one number
                // and one special character

                const mailRgx = /^[a-z0-9._%+-]{1,64}@[a-z0-9.-]+\.[a-z]{2,255}$/i;
                // Minuscule, maj et nombres acceptes, taille de 4 a 25 char


                // testing regex
                if (userNameRgx.test(userName) === true) {
                    if (firstName.test(nameRgx) === true) {
                        if (lastName.test(nameRgx) === true) {
                            if (pass.test(passRgx) === true) {
                                if (mail.test(mailRgx) === true) {
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
                                    }
                                else
                                    {
                                        reject(Error('invalid mail'));
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
                        reject(Error('invalid mail'));
                    }
                }
            } else {
                reject(Error('missing var or invalid type'));
            }
        }
    );
};