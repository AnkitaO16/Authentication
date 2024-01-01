const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

// function isCorotsystemsEmail(value) {
//   // Check if the email ends with @corotsystems.com
//   if (value.endsWith('@corotsystems.com')) {
//     return true;
//   }
//   return false;
// }


const addressSchema = new mongoose.Schema({
  Country: String,
  State: String,
  District: String,
  City: String,
  Pincode: String
});

const userSchema = new mongoose.Schema({
  firstName: String,
  // MiddleName: String,
  lastName: String,
  email: {
      type: String, // Allows multiple email addresses, if needed
      required: true,
      unique: true,
      lowercase: true,
      trim: true
  },
  phone: {
      type: [String], // Allows multiple phone numbers, if needed
      required: true,
      trim: true
  },
  password: {
      type: String,
      required: true
  },
  address: {
      type: addressSchema,
      required: true
  }
});



// const userSchema = new mongoose.Schema({
//     email:{
//         type:String,
//         required:[true,"Please add an Email"],
//         unique:true,
//         lowercase:true,      
//         validate:[isEmail, "Please enter a valid Email"]
//         // validate: [
//         //   isEmail, // Use the isEmail validator first
//         //   {
//         //     validator: isCorotsystemsEmail,
//         //     message: "Email must be from corotsystems.com domain",
//         //   },
//         // ]
//     },
//     password:{
//         type : String ,
//         required: [true ,"Please enter a password"],
//         minlength:[ 6 ,"Minimum password length is 6 character"]
//     }
// });

userSchema.pre('save',async function(next){
    //encrpt the password
    this.password=await bcrypt.hash( this.password ,12);
    // const salt = await bcrypt.genSalt()
    // this.password = await bcrypt.hash(this.password,salt)
    next()
});

userSchema.statics.login = async function (email, password) {
    // Find the user in the database by email
    const user = await this.findOne({ email });
    if (user) {
      // Compare the input password with the user's hashed password
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user; // Authentication successful, return the user
      } else {
        throw new Error("Incorrect password");
      }
    } else {
      throw new Error("User not found !"); // User with the provided email not found
    }
  };
  
const User = mongoose.model('user', userSchema)

module.exports = User;