// // check var existence
if (req.body.login && req.body.firstName && req.body.lastName &&
    req.body.pass && req.body.confirmpass && req.body.mail) {

    // check password matching
    if (req.body.pass === req.body.confirmpass) {

        // var security
        let login = eschtml(req.body.login),
            firstName = eschtml(req.body.firstName),
            lastName = eschtml(req.body.lastName),
            pass = eschtml(req.body.pass),
            mail = eschtml(req.body.mail);

        // regex definition
        const loginRgx = /^[a-z0-9]{2,50}$/i;
        // Minuscule, maj et nombres acceptes, taille de 4 a 25 char

        const nameRgx = /^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]+\.?(([',. -][a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]\.?)?[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]*\.?)*[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]?\.?$/i;
        // Minuscule, maj, nombres et caracteres avec accents acceptes, taille de 2 a 40 char

        const passRgx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
        // between 8 and 50 characters, at least one uppercase letter, one lowercase letter, one number
        // and one special character

        const mailRgx = /^[a-z0-9._%+-]{1,64}@[a-z0-9.-]+\.[a-z]{2,255}$/i;
        // Minuscule, maj et nombres acceptes, taille de 4 a 25 char


        // testing regex
        if (loginRgx.test(login) === true) {
            if (firstName.test(nameRgx) === true) {
                if (lastName.test(nameRgx) === true) {
                    if (pass.test(passRgx) === true) {
                        if (mail.test(mailRgx) === true) {
                            connection.connect();
                            connection.query('CREATE DATABASE IF NOT EXISTS `Matcha`', null, function (err, res) {
                                if (err) throw err;
                                if (res.warningCount === 0) {
                                    console.log('Database created');
                                }
                            });

                        } else {
                            res.status(400).send(error, {error: 'invalid mail'})
                        }
                    } else {
                        res.render('register.ejs', {error: 'invalid password'})
                    }
                } else {
                    res.render('register.ejs', {error: 'invalid lastName'})
                }
            } else {
                res.render('register.ejs', {error: 'invalid firstName'})
            }
        } else {
            res.render('register.ejs', {error: 'invalid mail'})
        }
    }
}

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});