const User = require('../model/User');
const jwt = require('jsonwebtoken');

const maxAge = 3*24*60*60

const createToken = (id) => {
   return jwt.sign({id}, 'secret', {expiresIn:maxAge})
}


//controller action
module.exports.signup_get = (req, res) => {
    res.render('signup')
}


const handleErrors = (err) => {
    console.log(err.message, err.code);

    let errors ={
        email:'',
        password:''
    }
    //incorrect mail
    if(err.message === "Incorrect Email"){
        errors.email = 'This email is not registerd';
    }

   //incorrect password    
    if(err.message === "Incorrect Password"){
        errors.password = 'This password is incorrect';
    }

   //duplicate email error    
    if(err.code === 11000){
        errors.email = 'This email is already registerd';
        return errors;
    }
   //validation error
   if(err.message.includes("user validation failed")) {

    Object.values(err.errors).forEach(({properties}) => {
        //  console.log({properties});
        errors[properties.path] = properties.message;
    });
}
  return errors;
};

//signup post
module.exports.signup_post = async (req, res) => {
  const { FirstName, LastName, Email, Phone, Password, Address } = req.body;

  try {
    // Check if the 'Password' field is provided in the request body
    if (!Password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Create a new user if the password is provided
    const newUser = await User.create({
      firstName: FirstName,
      lastName: LastName,
      email: Email,
      phone: Phone,
      password: Password,
      address: Address,
    });

    res.status(201).json({ status: "ok", user: newUser });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
// async(req, res) => {    
//   const  {email,password} = req.body
//   // console.log(email)
//   // console.log(password)
//  console.log(req.body);
//   try{
//     const user = await User.create({
//          email , password
//     });

    // const token = createToken(user._id)
    //  res.cookie('jwt' , token, {
    //   httpOnly:true,
    //   maxAge:maxAge 
    //   // domain:'localhost',
    //   // path:'/'
    // })
    // res.status(201).json({user:user._id});


//   }catch(err){
// //    console.log(err)
//    const errors = handleErrors(err)
//    res.status(400).json({errors});
//   }
//     //res.send('user created!')
// }

module.exports.login_get = (req, res) => {
    res.render('login')
};

module.exports.logout_get = (req, res ,next) => {
  res.cookie("jwt" , '',{maxAge:1})
  res.redirect('/')
  next();
  
};



//login_post
module.exports.login_post = async (req, res) => {
  // res.send('login successful!')

  const { email, password } = req.body;
  try {
    const user = await User.login(email, password)

    const token = createToken(user._id)
    res.cookie('jwt' , token, {
      httpOnly:true,
      maxAge:maxAge,
      domain:'localhost',
      path:'/'
    })
    // console.log("token",token,"user id ",user._id ) //
    res.status(200).json({ user:user._id })
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

