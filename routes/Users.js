const express  = require('express');
const users  = express.Router()
const cors = require('cors');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database/db.js');
const {hashPassword} = require('../models/User'); 

users.use(cors());
process.env.SECRET_KEY = 'secret';

//REGISTER
users.post('/register', (req,res) => {
	const { email, password, first_name, last_name, mob, dob } = req.body;
	if(!email || !password || !mob) {
		return res.status(400).json('incorrect form submission');
	}
	var sqlFetch = "Select * from users where email = '"+email+"'";
	db.query(sqlFetch, async (err,rows) => {
		if(err) {
			res.send('empty');res.send('empty');
		} else {
			if(rows.length) {
				res.status(400).json('unable to register');
			} else {
				const hashedPswd = await hashPassword(password);
				var sqlInsert = "INSERT INTO users(firstname,lastname,email,mobile,dob,password)values(\
								'"+first_name+"','"+last_name+"','"+email+"','"+mob+"','"+dob+"','"+hashedPswd+"')";
				db.query(sqlInsert, (err,rows) => {
					if(err) {
						res.status(400).json('unable to register');
					} else {
						if(rows) {
							res.json(first_name);	
						} else {
							res.status(400).json('unable to register');
						}
					}
				})
			}
		}
	});
});

//LOGIN
users.post('/login', (req,res) => {
	const {email, password} = req.body;
	var sqlFetch = "Select password from users where email = '"+email+"'";
	if(!email || !password) {
		return res.status(400).json('Incorrect form submission');
	}
	db.query(sqlFetch, (err,rows) => {
		if(err) {
			res.send(err);
		} else {
			if(rows.length === 1) {
				if(bcrypt.compareSync(password, rows[0].password)) {
					var fetchUser = "Select * from users where email = '"+email+"' ";
			        db.query(fetchUser, (err,user) => {
			        	const payload = JSON.stringify(user[0]);
		          	    let token = jwt.sign(JSON.parse(payload), process.env.SECRET_KEY, { expiresIn: 1440 });
		          	    res.send(token);
			        });
			    } else {
			        res.status(400).json('Wrong Credentials!')
			    }
			} else {
				res.send(0);
			}
		}
	});
});

module.exports = users
