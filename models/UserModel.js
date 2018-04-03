let mongoose = require('mongoose');
let Schema   = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


// used example from class exercises as well as https://stackoverflow.com/questions/14588032/mongoose-password-hashing
var UserSchema = new Schema({
  // email serves as unique username
  'email' : {
    type: String,
    require: true,
    // unique: true,
    match: [/.+@.+\..+/],
    validate: [input => input.length],
    index: true

  },

	'name' : {
    type: String,
    trim: true,
    required: "Name is required (not used as your userId, your email does that)"
  },

	'passwordHash' : {
    type:String,
    trim: true,
    select: false
    // required: "Passsword is Required",
    // validate: [input=> input.length >= 6, "Password should be atleast 6 characters."]
  },
	// 'passwordsalt' : String,
  'passwordSetDate' : Date,
  'accountLocked': Boolean,
  'role': String,
	// 'savedArticles' : Array
  'savedArticles': [{type: Schema.Types.ObjectId, ref: 'Headline' }]
}, {timestamps: true});

// Virtuals
UserSchema
  .virtual('password')
  .set(function(password) {
    console.log("in UserSchema set function, password: ", password)
    this._password = password
  })

UserSchema.pre("save", function(next)  {
  console.log("in UserSchema pre 'save' function, this: ", this)

  const user = this;
  if (user._password === undefined) {
    return next();
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) console.log(err);
    bcrypt.hash(user._password, salt, (err, hash) => {
      if (err) console.log(err);
      user.passwordHash = hash;
      next();
    })
  })
})

UserSchema.methods = {
  comparePassword: function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch)  {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  }
}


// UserSchema.methods.comparePassword = (candidatePassword, cb) => {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch)  {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// }

var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

UserSchema.statics.getAuthenticated = function(email, password, cb) {
    this.findOne({ email: email }, function(err, user) {
        if (err) return cb(err);

        // make sure the user exists
        if (!updatesser) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if (user.accountLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};



module.exports = mongoose.model('User', UserSchema);
