const userModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

class UserController {
  
  async userExists(formData) {
    // user = new UserModel();
    // const response = await userModel.userExists();
    const response = true;
    return response;
  }

  async getUserData(formData) {
    // try {
    // const userData = await userModel.getUserData();
    // }
    // catch(e)
    const userData = {
      id: 1,
      firstName: 'Adam',
      lastName: 'Ceciora',
      username: formData.username,
      photoUrl: 'https://cdn.intra.42.fr/users/small_aceciora.jpg',
      loggedIn: true
    }
    return userData;
  }

  signin() {
    //appel bdd pour set user a loggedIn
  }

}

module.exports = UserController;