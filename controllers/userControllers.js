const UserModel = require('../models/userschema');
const bcrypt = require('bcrypt');

const userHome = (req, res) => {
  res.render(process.cwd() + '/views/login');
};

const registerUser = (req, res, next) => {
  UserModel.findOne({ username: req.body.username }, (err, data) => {
    var hash = bcrypt.hashSync(req.body.password, 12);
    if (err) {
      console.log(err);
    } else if (data) {
      res.render(process.cwd() + '/views/login', { message: 'Username already exists' });
    } else {
      let user = new UserModel({
        username: req.body.username,
        password: hash
      });
      user.save((err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect(307, '/profile');
        }
      });
    }
  });
};

const loginUser = (req, res) => {
  res.redirect(307, '/profile');
};

const userProfileGet = (req, res) => {
  res.render(process.cwd() + '/views/profile');
};

const userProfilePost = (req, res) => {
  uName = req.body.username;
  UserModel.findOne({ username: req.body.username }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.books.length > 0) {
        let bookData = data.books.map(obj => {
          return {
            title: obj.title.toLowerCase(),
            author: obj.author.toLowerCase(),
            count: obj.comments.length,
            comment: obj.comments,
            id: obj._id
          };
        });
        res.render(process.cwd() + '/views/profile', { books: bookData });
      } else {
        res.render(process.cwd() + '/views/profile');
      }
    }
  });
};

const userBooks = (req, res) => {
  UserModel.findOne({ username: req.body.username }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let book = {
        title: req.body.title.toLowerCase(),
        author: req.body.author.toLowerCase(),
        comments: []
      };
      data.books.unshift(book);
      data.save((err, info) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect(307, '/profile');
        }
      });
    }
  });
};

const bookComment = (req, res) => {
  uName = req.body.username;
  UserModel.findOne({ "books._id": req.body.id }, (err, data) => {
    for (let i = 0; i < data.books.length; i++) {
      if (data.books[i]._id == req.body.id) {
        data.books[i].comments.unshift(req.body.comments.toLowerCase());
        data.save((err, info) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect(307, '/profile');
          }
        });
      }
    }
  });
};

const logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

const delOne = (req, res) => {
  UserModel.findOneAndUpdate({ username: req.body.username },
    { $pull: { books: { _id: req.body.id } } },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect(307, '/profile');
      }
    });
};

const delAll = (req, res) => {
  UserModel.findOneAndUpdate({ username: req.body.username },
    { $pull: { books: {} } },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect(307, '/profile');
      }
    });
};

module.exports = {
  registerUser, loginUser, userProfileGet, userProfilePost, userHome, userBooks, bookComment, logout, delOne, delAll
};