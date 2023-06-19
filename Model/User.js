const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema 

const userSchema = new Schema ({
    Email: {
        type: String,
        required: [true, 'Please enter a valid email id.'],
        unique: true,
        lowercase: [true, 'Email can only be in lowercase.'],
        validate: [isEmail, 'Please enter a valid email.']
    },
    Password: {
        type: String,
        required: true,
        minlength: [8, 'Password should minimum contain 8 letters.']
    }
}, {timestamps: true})

userSchema.post('save', function (doc, next) {
    console.log('New user was created and saved.', doc)
    next()
} )


// fire a function before saving
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.Password = await bcrypt.hash(this.Password, salt)
    next()
})

// static method to login user
userSchema.statics.login = async function(Email, Password) {
    const user = await this.findOne({ Email });
    if (user) {
      const auth = await bcrypt.compare(Password, user.Password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };

module.exports = mongoose.model('user', userSchema)