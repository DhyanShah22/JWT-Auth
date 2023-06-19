const {default: mongoose} = require('mongoose')
const User = require('../Model/User')


const handleErrors = (error) => {
    console.log(error.message, error.code)
    let errors = { Email: '' , Password: ''}

      // incorrect email
    if (error.message === 'incorrect email') {
      errors.Email = 'That email is not registered';
    }

    // incorrect password
    if (error.message === 'incorrect password') {
      errors.Password = 'That password is incorrect';
    }


    // Duplicate code error
    if(error.code = 11000) {
        errors.Email = 'This Email is already registered.'
        return errors
    }
    // validatiopn err
    if(error.message.includes('user validation failed')) {
        Object.values(error.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'Dhyan Shah secret', {
    expiresIn: maxAge
  });
};


const getSignup = async (req,res) => {
    res.render('signup')
}

const getLogin = async (req,res) => {
    res.render('login')
}

const postSignup = async (req,res) => {
    const {Email, Password} = req.body
    try {
        const user = await User.create({Email, Password})
        res.status(200).json(user)
    }
    catch(error) {
        const errors = handleErrors(error)
        return res.status(404).json({ errors })
    }
}

const postLogin = async (req,res) => {
    const { Email, Password } = req.body;


  try {
    const user = await User.login(Email, Password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

const getLogout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }
module.exports = {
    getLogin,
    getSignup,
    postLogin,
    postSignup,
    getLogout
}