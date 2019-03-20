const Eschtml = require('htmlspecialchars');
const bcrypt = require('bcrypt');

const Mysql = require('mysql');
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

//╔═════════════════════════════════════════════════════════════════╗
//║ 						    password							║
//╚═════════════════════════════════════════════════════════════════╝

const PasswordChange = (oldPasswordNsfw, newPasswordNsfw, confirmPasswordNsfw, userID) => {
	return new Promise((resolve, reject) => {
		if (typeof oldPasswordNsfw !== "string" || typeof newPasswordNsfw !== "string" || typeof confirmPasswordNsfw !== "string" || userID < 1) {
			reject({1: 'missing variable or invalid type'});
		} else if (newPasswordNsfw !== confirmPasswordNsfw) {
			reject({2: 'confirm password is different than the new one'});
		} else {
			let oldPassword = Eschtml(oldPasswordNsfw);
			let newPassword = Eschtml(newPasswordNsfw);

			const PassRgx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
			if (PassRgx.test(newPassword) === false) {
				reject({3: 'invalid new Password'});
			}

			Connection.connect(null, (err) => {
				if (err) reject(err);
				Connection.query("SELECT `password` FROM `users` WHERE `ID` = ?", [userID], (err, result) => {
					if (err) reject(err);
					else if (!bcrypt.compareSync(oldPassword,result[0].password)) reject({4: 'invalid old Password'});
					else {
						let pass = bcrypt.hashSync(newPassword, 10);

						Connection.query("UPDATE `users` SET `password` = ? WHERE `ID` = ?", [pass, userID], (err) => {
							if (err) reject(err);
							else resolve({0: true});
						})
					}
				})
			})
		}
	})
};

//╔═════════════════════════════════════════════════════════════════╗
//║ 						    lastName							║
//╚═════════════════════════════════════════════════════════════════╝

const LastNameChange = (lastNameNsfw, userID) => {
	return new Promise((resolve, reject) => {
		if (typeof lastNameNsfw !== "string" || userID < 1) {
			reject({1: 'missing variable or invalid type'});
		} else {
			let lastName = Eschtml(lastNameNsfw);

			const nameRgx = /^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]+\.?(([',. -][a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]\.?)?[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]*\.?)*[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]?\.?$/i;
			if (nameRgx.test(lastName) === false) {
				reject({2: 'invalid last name'});
			}

			Connection.connect(null, (err) => {
				if (err) reject(err);
				Connection.query("UPDATE `users` SET `lastName` = ? WHERE `ID` = ?", [lastName, userID], (err) => {
					if (err) reject(err);
					else resolve({0: true});
				})
			})
		}
	})
};

//╔═════════════════════════════════════════════════════════════════╗
//║ 						    first name							║
//╚═════════════════════════════════════════════════════════════════╝

const FirstNameChange = (firstNameNsfw, userID) => {
	return new Promise((resolve, reject) => {
		if (typeof firstNameNsfw !== "string" || userID < 1) {
			reject({1: 'missing variable or invalid type'});
		} else {
			let firstName = Eschtml(firstNameNsfw);

			const nameRgx = /^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]+\.?(([',. -][a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]\.?)?[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]*\.?)*[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð]?\.?$/i;
			if (nameRgx.test(firstName) === false) {
				reject({2: 'invalid first name'});
			}

			Connection.connect(null, (err) => {
				if (err) reject(err);
				Connection.query("UPDATE `users` SET `firstName` = ? WHERE `ID` = ?", [firstName, userID], (err) => {
					if (err) reject(err);
					else resolve({0: true});
				})
			})
		}
	})
};

//╔═════════════════════════════════════════════════════════════════╗
//║ 						    email								║
//╚═════════════════════════════════════════════════════════════════╝

const EmailChange = (emailNsfw, userID) => {
	return new Promise((resolve, reject) => {
		if (typeof emailNsfw !== "string" || userID < 1) {
			reject({1: 'missing variable or invalid type'});
		} else {
			let email = Eschtml(emailNsfw);

			const emailRgx = /^[a-z0-9._%+-]{1,64}@[a-z0-9._-]+\.[a-z]{2,255}$/i;
			if (emailRgx.test(email) === false) {
				reject({2: 'invalid email'});
			}

			Connection.connect(null, (err) => {
				if (err) reject(err);
				Connection.query("SELECT COUNT(*) AS emailCount FROM `users` WHERE `email` = ?", [email], (err, result) => {
					if (err) reject(err);
					if (result[0].emailCount != 0) reject({9: 'email already used'});
					else {
						Connection.query("UPDATE `users` SET `email` = ? WHERE `ID` = ?", [email, userID], (err) => {
							if (err) reject(err);
							else resolve({0: true});
						})
					}
				})

			})
		}
	})
};

//╔═════════════════════════════════════════════════════════════════╗
//║ 						    validKey							║
//╚═════════════════════════════════════════════════════════════════╝

const ValidKeyChange = (validKey, userID) => {
	return new Promise((resolve, reject) => {
		if (typeof validKey !== "string" || userID < 1) {
			reject({1: 'missing variable or invalid type'});
		} else {
			Connection.connect(null, (err) => {
				if (err) reject(err);
				Connection.query("UPDATE `users` SET `validKey` = ? WHERE `ID` = ?", [validKey, userID], (err) => {
					if (err) reject(err);
					else resolve({0: true});
				})
			})
		}
	})
};

//╔═════════════════════════════════════════════════════════════════╗
//║ 						    	age								║
//╚═════════════════════════════════════════════════════════════════╝


const AgeChange = (ageNsfw, userID) => {
	return new Promise((resolve, reject) => {
		if (typeof ageNsfw !== "string" || userID < 1) {
			reject({1: 'missing variable or invalid type'});
		} else {
			let age = Eschtml(ageNsfw);

			const ageRgx = /^\d{1,3}$/i;
			if (ageRgx.test(age) === false) {
				reject({2: 'invalid age'});
			}

			Connection.connect(null, (err) => {
				if (err) reject(err);
				Connection.query("UPDATE `users` SET `age` = ? WHERE `ID` = ?", [age, userID], (err) => {
					if (err) reject(err);
					else resolve({0: true});
				})
			})
		}
	})
};

//╔═════════════════════════════════════════════════════════════════╗
//║ 						    shortBio							║
//╚═════════════════════════════════════════════════════════════════╝

const ShortBioChange = (shortBioNsfw, userID) => {
	return new Promise((resolve, reject) => {
		if (typeof shortBioNsfw !== "string" || userID < 1) {
			reject({1: 'missing variable or invalid type'});
		} else {
			let shortBio = Eschtml(shortBioNsfw);

			Connection.connect(null, (err) => {
				if (err) reject(err);
				Connection.query("UPDATE `users` SET `shortBio` = ? WHERE `ID` = ?", [shortBio, userID], (err) => {
					if (err) reject(err);
					else resolve({0: true});
				})
			})
		}
	})
};

//╔═════════════════════════════════════════════════════════════════╗
//║ 					    profilePictureID						║
//╚═════════════════════════════════════════════════════════════════╝

const ProfilePictureChange = (profilePictureID, userID) => {
	return new Promise((resolve, reject) => {
		Connection.connect(null, (err) => {
			if (err) reject(err);
			Connection.query("UPDATE `users` SET `profilePictureID` = ? WHERE `ID` = ?", [profilePictureID, userID], (err) => {
				if (err) reject(err);
				else resolve({0: true});
			})
		})
	})
};

//╔═════════════════════════════════════════════════════════════════╗
//║ 						   online								║
//╚═════════════════════════════════════════════════════════════════╝

const onlineChange = (online, userID) => {
	return new Promise((resolve, reject) => {
		Connection.connect(null, (err) => {
			if (err) reject(err);
			Connection.query("UPDATE `users` SET `online` = ? WHERE `ID` = ?", [online, userID], (err) => {
				if (err) reject(err);
				else resolve({0: true});
			})
		})
	})
};

//╔═════════════════════════════════════════════════════════════════╗
//║ 						  lastLog								║
//╚═════════════════════════════════════════════════════════════════╝
// `lastLog` DATETIME NULL DEFAULT NULL,

//╔═════════════════════════════════════════════════════════════════╗
//║ 					    orientation								║
//╚═════════════════════════════════════════════════════════════════╝

const orientationChange = (orientations_ID, userID) => {
	return new Promise((resolve, reject) => {
		Connection.connect(null, (err) => {
			if (err) reject(err);
			Connection.query("UPDATE `users` SET `orientations_ID` = ? WHERE `ID` = ?", [orientations_ID, userID], (err) => {
				if (err) reject(err);
				else resolve({0: true});
			})
		})
	})
};

//╔═════════════════════════════════════════════════════════════════╗
//║ 						    gender								║
//╚═════════════════════════════════════════════════════════════════╝

const GenderChange = (genders_ID, userID) => {
	return new Promise((resolve, reject) => {
		Connection.connect(null, (err) => {
			if (err) reject(err);
			Connection.query("UPDATE `users` SET `genders_ID` = ? WHERE `ID` = ?", [genders_ID, userID], (err) => {
				if (err) reject(err);
				else resolve({0: true});
			})
		})
	})
};

//╔═════════════════════════════════════════════════════════════════╗
//║ 						  user status							║
//╚═════════════════════════════════════════════════════════════════╝

const UserStatusChange = (userStatus_ID, userID) => {
	return new Promise((resolve, reject) => {
		Connection.connect(null, (err) => {
			if (err) reject(err);
			Connection.query("UPDATE `users` SET `userStatus_ID` = ? WHERE `ID` = ?", [userStatus_ID, userID], (err) => {
				if (err) reject(err);
				else resolve({0: true});
			})
		})
	})
};

//╔═════════════════════════════════════════════════════════════════╗
//║ 						  Coordinates							║
//╚═════════════════════════════════════════════════════════════════╝
// `longitude` DECIMAL(7,4) NULL DEFAULT NULL,
// `latitude` DECIMAL(7,4) NULL DEFAULT NULL,

//╔═════════════════════════════════════════════════════════════════╗
//║ 						    city								║
//╚═════════════════════════════════════════════════════════════════╝
// `city` VARCHAR(45) NULL DEFAULT NULL,

PasswordChange('Lunafang23?', 'Lunafang234?', 'Lunafang234?', '1').then(res => {
	console.log(res)
}).catch(err => {
	console.log(err)
});
