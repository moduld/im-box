const express = require('express');
const router = express.Router();
const uuid = require('uuid/v1');
const mongoose = require('mongoose');
const crypto = require('../modules/crypto');
const fs = require('fs');

const config = require('../configs/config');
const User = require('../models/user');
const Collection = require('../models/collection');
const Image = require('../models/image');
const validators = require('../modules/validators');
const FileHandle = require('../modules/files-handle');

const dataObjectsCreate = require('../modules/data-objects-create');
mongoose.connect(config.database);

const prefix = config.prefix;

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
          if (user && user.password === crypto(req.body.password, user.secret)) {
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
            res.status(401).json({message: 'Wrong credentials', success: false});
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
      user: req.currentUser._id
    };
    Collection.create(newCollection)
      .then(collection => {
          let resp = {
            id: collection.id,
            title: collection.title,
            description: collection.description,
            thumbnail: collection.thumbnail
          };
          res.status(201).json(resp);
      })
      .catch(() => {
        res.status(500).json({message: 'Server error', success: false});
      });
  } else {
    res.status(400).json({success: false, message: `Title is required`});
  }
});

router.get(`${prefix}/collections`, (req, res) => {
    Collection.find({user: req.currentUser._id})
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
        if (collection.user.toString() === req.currentUser._id.toString()) {
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
        if (collection.user.toString() === req.currentUser._id.toString()) {
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
          if (collection.user === req.currentUser._id) {
            Collection.remove({id: collId})
              .then(() => {
                Image.find({collectionId: collId})
                  .then(images => {
                    images.forEach(img => {
                      fs.unlinkSync(img.path);
                    })
                  })
                  .catch(() => {});
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

router.post(`${prefix}/images`,  (req, res) => {
    FileHandle.single('image')(req, res,function(err) {
      if (err) {
        res.status(422).json({message: 'File is too big', success: false});
        return;
      }
      if (req.fileValidationError) {
        res.status(422).json({message: 'Only png, jpg, gif formats are applied', success: false});
        return;
      }
      if (req.body.collectionId && req.file) {
        Collection.findOne({id: req.body.collectionId})
          .then(collection => {
            if (collection) {
              if (collection.user === req.currentUser._id) {
                let imageObject = {
                  name: req.file.filename,
                  id: req.file.id,
                  title: req.body.title ? req.body.title : req.file.originalname.substring(1, 100),
                  user: req.currentUser._id,
                  collectionId: req.body.collectionId,
                  path: req.file.path,
                  mime: req.file.mimetype
                };
                Image.create(imageObject)
                  .then((img) => {
                    let resp = {
                      path: img.path,
                      id: img.id,
                      collectionId: img.collectionId,
                      title: img.title
                    };
                    res.status(201).json(resp);
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
      } else {
        res.status(400).json({success: false, message: `Collection id and image are required`});
      }

    });
});

router.get(`${prefix}/collections/:id/images`, (req, res) => {
  let collId = req.params.id;
    Image.find({collectionId: collId})
      .then(collection => {

        let output = collection.map(coll => {
          return {
            id: coll.id,
            title: coll.title,
            path: coll.path,
            collectionId: coll.collectionId
          }
        });
        res.status(200).json(output)
       })
       .catch(() => {
         res.status(500).json({message: 'Server error', success: false});
       });
});

router.get(`${prefix}/images/:id`, (req, res) => {
  let imgId = req.params.id;
  Image.findOne({id: imgId})
    .then(img => {
      if (img) {
        let output =  {
          id: img.id,
          title: img.title,
          path: img.path,
          collectionId: img.collectionId
        };
        res.status(200).json(output);
      } else {
        res.status(404).json({message: 'No such image', success: false});
      }
    })
    .catch(() => {
      res.status(500).json({message: 'Server error', success: false});
    });
});

router.delete(`${prefix}/images/:id`, (req, res) => {
  let imgId = req.params.id;
  Image.findOne({id: imgId})
    .then(img => {
      if (img) {
        if (img.user === req.currentUser._id) {
          Image.remove({id: imgId})
            .then()
            .catch()
        }
      } else {
        res.status(404).json({message: 'No such image', success: false});
      }
    })
    .catch(() => {
      res.status(500).json({message: 'Server error', success: false});
    });
});

module.exports = router;
