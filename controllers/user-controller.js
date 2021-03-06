const { Thought, User } = require('../models');

const userController = {
  // get all users
  getAllUser(req, res){
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__V'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },
  // get one User by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(dbNoteData => res.json(dbNoteData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // createUser
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  // update User by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // delete User
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  addFriend({ params }, res){
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true }
      )
      .then(dbUserData => {
        if(!dbUserData){
          res.status(404).json({message: 'no user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })  
      .catch(err => res.json(err));
  },

  // left off here need to verify that this works
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { users: {friends: params.userId } }},
      { new: true }
      )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  }
}

module.exports = userController;