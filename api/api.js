const express = require('express');
const router = express.Router();
const uuid = require('uuid/v1');
const mongoose = require('mongoose');


const config = require('../configs/config');
const User = require('../models/user');
const Collection = require('../models/collection');
const Image = require('../models/image');
const validators = require('../modules/validators');
const FileHandle = require('../modules/files-handle').upload;

const dataObjectsCreate = require('../modules/data-objects-create');
mongoose.connect(config.database);

const prefix = config.prefix;


var fs = require('fs');

router.post(`${prefix}/registration`, (req, res) => {
  let data = req.body;
  let validation = validators.validateRegistrationData(data);
  if (validation.success) {
    User.findOne({email: data.email})
      .then(user => {
        if (user) {
          res.status(409).json({message: 'User exists', success: false});
        } else {
          let userObject = new dataObjectsCreate.makeRegistrationUser(data);
          User.create(userObject)
            .then(user => {
              res.status(201).json(
                {
                  success: true,
                  token: user.token,
                  user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                  }
                });
            })
            .catch(() => {
              res.status(500).json({message: 'Server error', success: false});
            });
        }
      })
      .catch(() => {
        res.status(500).json({message: 'Server error', success: false});
      });
  } else {
    res.status(400).json(validation);
  }
});


router.post(`${prefix}/login`, (req, res) => {
  let data = req.body;
  let validation = validators.validateLoginData(data);
  if (validation.success) {
    User.findOne({email: data.email})
      .then(user => {
        if (user) {
          if (user.expired > new Date().getTime()) {
            res.status(200).json(
              {
                success: true,
                token: user.token,
                user: {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email
                }
              });
          } else {
            let updatedData = new dataObjectsCreate.makeUserUpdateData(user.email);
            User.findByIdAndUpdate(user._id, updatedData, {new: true})
              .then(updated => {
                res.status(200).json(
                  {
                    success: true,
                    token: updated.token,
                    user: {
                      firstName: updated.firstName,
                      lastName: updated.lastName,
                      email: updated.email
                    }
                  });
              })
              .catch(() => {
                res.status(500).json({message: 'Server error', success: false});
              });
          }
        } else {
          res.status(404).json({message: 'User not found', success: false});
        }
      })
      .catch(() => {
        res.status(500).json({message: 'Server error', success: false});
      });
  } else {
    res.status(400).json(validation);
  }
});

router.use((req, res, next) => {
  let token = req.headers['authorization'];
  if (token) {
    User.findOne({token: token})
        .then(user => {
          if (user) {
            if (user.expired < new Date().getTime()) {
              res.status(403).send({
                success: false,
                message: 'Token expired'
              })
            } else {
              req.currentUser = user;
              next();
            }
          } else {
            res.status(403).send({
              success: false,
              message: 'Unauthorized'
            })
          }
        })
      .catch(() => {
        res.status(500).json({message: 'Server error', success: false});
      });

  } else {
    res.status(403).send({
      success: false,
      message: 'Unauthorized'
    })
    // if (req.method === 'GET') {
    //   res.redirect('/');
    // } else {
    //   res.status(403).send({
    //     success: false,
    //     message: 'Unauthorized'
    //   })
    // }
  }
});

router.post(`${prefix}/collections`, (req, res) => {
  let data = req.body;
  if (data.title) {
    let newCollection = {
      id: uuid(),
      title: data.title,
      thumbnail: '',
      user: req.currentUser.token
    };
    Collection.create(newCollection)
      .then(collection => {
          let respObj = {
            id: collection.id,
            title: collection.title,
            description: collection.description,
            thumbnail: collection.thumbnail
          };
          res.status(201).json({collection: respObj, success: true});
      })
      .catch(() => {
        res.status(500).json({message: 'Server error', success: false});
      });
  } else {
    res.status(400).json({success: false, message: `Title is required`});
  }
});

router.get(`${prefix}/collections`, (req, res) => {
    Collection.find({user: req.currentUser.token})
      .then(collections => {
        let rez = collections.map(coll => {
          return {
            id: coll.id,
            title: coll.title,
            thumbnail: coll.thumbnail,
          };
        });
        res.status(200).json(rez);
      })
      .catch(() => {
        res.status(500).json({message: 'Server error', success: false});
      });
});

router.get(`${prefix}/collections/:id`, (req, res) => {
  let collId = req.params.id;
  Collection.findOne({id: collId})
    .then(collection => {
      if (collection) {
        if (collection.user === req.currentUser.token) {
          let output = {
            id: collection.id,
            title: collection.title,
            thumbnail: collection.thumbnail,
            images: collection.images
          };
          res.status(200).json(output)
        } else {
          res.status(401).json({message: 'Access denied', success: false})
        }
      } else {
        res.status(404).json({message: 'Collection is not found', success: false})
      }

      })
    .catch(() => {
      res.status(500).json({message: 'Server error', success: false});
    });
});

router.put(`${prefix}/collections/:id`, (req, res) => {
  let collId = req.params.id;
  let data = req.body;
  if (data.title || data.newThumbnail) {
    Collection.findOne({id: collId})
      .then(collection => {
        if (collection.user === req.currentUser.token) {
          let updatedData = {};
          data.title ? updatedData['title'] = data.title : '';
          data.newThumbnail ? updatedData['thumbnail'] = data.newThumbnail : '';
          Collection.findByIdAndUpdate(collection._id, updatedData, {new: true})
            .then(collection => {
              let output = {
                id: collection.id,
                title: collection.title,
                thumbnail: collection.thumbnail,
                images: collection.images
              };
              res.status(201).json(output);
            })
            .catch(() => {
              res.status(500).json({message: 'Server error', success: false});
            });
        } else {
          res.status(401).json({message: 'Access denied', success: false})
        }
      })
      .catch(() => {
        res.status(500).json({message: 'Server error', success: false});
      });
  } else {
    res.status(400).json({success: false, message: `Title or image id is required`});
  }
});

router.delete(`${prefix}/collections/:id`, (req, res) => {
  let collId = req.params.id;
    Collection.findOne({id: collId})
      .then(collection => {
        if (collection) {
          if (collection.user === req.currentUser.token) {
            Collection.remove({id: collId})
              .then(() => {
                res.status(201).json({success: true});
              })
              .catch(() => {
                res.status(500).json({message: 'Server error', success: false});
              });
          } else {
            res.status(401).json({message: 'Access denied', success: false})
          }
        } else {
          res.status(404).json({message: 'Collection is not found', success: false})
        }
      })
      .catch(() => {
        res.status(500).json({message: 'Server error', success: false});
      });
});



router.post(`${prefix}/images`, FileHandle.single('image'), (req, res) => {
  let data = req.body;
  let file = req.file;
  // console.log(req.body)
  // console.log(req.file)
  if (data.collectionId && file) {

    // Collection.findOne({id: data.collectionId})
    //   .then(collection => {
    //     if (collection) {
    //       if (collection.user === req.currentUser.token) {
    //
    //         // Image.create({id: collId})
    //         //   .then(() => {
    //         //     res.status(201).json({success: true});
    //         //   })
    //         //   .catch(() => {
    //         //     res.status(500).json({message: 'Server error', success: false});
    //         //   });
    //
    //       } else {
    //         res.status(401).json({message: 'Access denied', success: false})
    //       }
    //     } else {
    //       res.status(404).json({message: 'Collection is not found', success: false})
    //     }
    //   })
    //   .catch(() => {
    //     res.status(500).json({message: 'Server error', success: false});
    //   });
  } else {
    res.status(400).json({success: false, message: `Collection id and image are required`});
  }
});

module.exports = router;
