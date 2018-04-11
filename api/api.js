const express = require('express');
const router = express.Router();
const uuid = require('uuid/v1');
const mongoose = require('mongoose');
const crypto = require('../modules/crypto');
const fs = require('fs');
const mv = require('mv');
const path = require('path');

const validAndSave = require('../modules/files-validation');
const config = require('../configs/config');
const User = require('../models/user');
const Collection = require('../models/collection');
const Image = require('../models/image');
const validators = require('../modules/validators');

const dataObjectsCreate = require('../modules/data-objects-create');
mongoose.connect(config.database).catch((data) => {
    console.log(data)
  });

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
  if (req.method !== 'OPTIONS') {
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
  } else {
    next()
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
          data.newThumbnail ? updatedData['thumbnailId'] = data.newThumbnail : '';
          if (data.newThumbnail) {
            Image.findOne({collectionId: collId, isThumbnail: true}, function (err, doc){
              if (err) {
                return;
              }
              if (doc) {
                doc.isThumbnail = false;
                doc.save();
              }
            });
            Image.findOne({id: data.newThumbnail}, function (err, doc){
              if (err) {
                return;
              }
              if (doc) {
                doc.isThumbnail = true;
                doc.save();
                updatedData.thumbnail = doc.path;
                updateCollection(updatedData);
              }
            });
          }
          if (!data.newThumbnail) {
            updateCollection(updatedData);
          }
          function updateCollection(data) {
            Collection.findByIdAndUpdate(collection._id, data, {new: true})
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
          }

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
        if (collection.user.toString() === req.currentUser._id.toString()) {
          Collection.remove({id: collId})
            .then(() => {
              Image.find({collectionId: collId})
                .then(images => {
                  console.log(images);
                  images.forEach(img => {
                    fs.unlink(img.path, err => {
                      if (err) {
                        console.log(err)
                      }
                    })
                  })
                })
                .catch(() => {
                });
              res.status(200).json({success: true});
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

router.post(`${prefix}/images`, validAndSave, (req, res) => {
  if (!req.fileValidationError) {
    Collection.findOne({id: req.fields.collectionId})
      .then(collection => {
        if (collection) {
          if (collection.user.toString() === req.currentUser._id.toString()) {
            let imageObject = {
              name: req.fileInfo.name,
              id: req.fileInfo.id,
              title: req.fileInfo.title,
              user: req.currentUser._id,
              collectionId: req.fields.collectionId,
              path: `uploads/${req.currentUser._id}/${req.fileInfo.id}.${req.fileInfo.extension}`,
              mime: req.fileInfo.mime,
              isThumbnail: false
            };
            Image.create(imageObject)
              .then((img) => {
                mv(req.fileInfo.tempPath, imageObject.path, {mkdirp: true}, function (err) {
                  if (err) {
                    res.status(500).json({message: 'Server error', success: false});
                  } else {
                    let resp = {
                      path: img.path,
                      id: img.id,
                      collectionId: img.collectionId,
                      title: img.title
                    };
                    res.status(201).json(resp);
                  }
                });
              })
              .catch((err) => {
                res.status(500).json({message: 'Server error', success: false});
              });
          } else {
            res.status(401).json({message: 'Access denied', success: false})
          }
        } else {
          res.status(404).json({message: 'Collection is not found', success: false})
        }
      })
      .catch((err) => {
        res.status(500).json({message: 'Server error', success: false});
      });
  } else {
    res.status(req.fileValidationError.status).json({message: req.fileValidationError.message, success: false});
  }
});

router.get(`${prefix}/collections/:id/images`, (req, res) => {
  let collId = req.params.id;
  Image.find({collectionId: collId})
    .then(collection => {

      let output = collection.map(img => {
        return {
          id: img.id,
          title: img.title,
          path: img.path,
          collectionId: img.collectionId,
          isThumbnail: img.isThumbnail
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
        let output = {
          id: img.id,
          title: img.title,
          path: img.path,
          collectionId: img.collectionId,
          isThumbnail: img.isThumbnail
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

router.delete(`${prefix}/images`, (req, res) => {
  let imagesArray = req.body;
  Image.find({"user": req.currentUser._id.toString(), "id": {$in: imagesArray}})
    .then(foundImages => {
      let mappedArray = foundImages.map(img => {
        return img.id
      });
      Image.remove({"id": {$in: mappedArray}})
        .then(() => {
          foundImages.forEach(img => {
            fs.unlink(img.path, err => {
              if (err) {
                console.log(err)
              }
            });
            if (img.isThumbnail) {
              Collection.findOne({id: img.collectionId})
                .then(collection => {
                  if (collection) {
                    collection.thumbnail = '';
                    collection.thumbnailId = '';
                    collection.save();
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });
          res.status(200).json({success: true});
        })
        .catch(err => {
          res.status(500).json({message: 'Server error', success: false});
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message: 'Server error', success: false});
    })
});

router.get(`${prefix}/images`, (req, res) => {
  Image.find({user: req.currentUser._id.toString()})
    .then(imgs => {
      let output = imgs.map(img => {
        return {
          id: img.id,
          title: img.title,
          path: img.path,
          collectionId: img.collectionId,
          isThumbnail: img.isThumbnail
        };
      });
      res.status(200).json(output);
    })
    .catch(() => {
      res.status(500).json({message: 'Server error', success: false});
    });
});

router.patch(`${prefix}/images`, (req, res) => {
  let imagesArray = req.body;
  let output = [];
  imagesArray.forEach((imageObject, index) => {
    if (imageObject.id && imageObject.newCollection) {
      Image.findOne({id: imageObject.id})
        .then(image => {
          if (image.user.toString() === req.currentUser._id.toString()) {
            Image.findByIdAndUpdate(image._id, {collectionId: imageObject.newCollection, isThumbnail: false}, {new: true})
              .then(updated => {
                output.push({
                  id: updated.id,
                  title: updated.title,
                  path: updated.path,
                  collectionId: updated.collectionId,
                  isThumbnail: updated.isThumbnail
                });
                if (image.isThumbnail) {
                  Collection.findOne({id: image.collectionId})
                    .then(collection => {
                      if (collection) {
                        collection.thumbnail = '';
                        collection.thumbnailId = '';
                        collection.save();
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
                if (index === imagesArray.length - 1) {
                  res.status(200).json(output);
                }
              })
              .catch(() => {
                res.status(500).json({message: 'Server error', success: false});
                return;
              })
          }
        })
        .catch(() => {
          res.status(500).json({message: 'Server error', success: false});
        });
    }
  })
});

router.put(`${prefix}/images/:id`, (req, res) => {
  let imgId = req.params.id;
  let title = req.body.title;
  if (title) {
    Image.findOne({id: imgId}, function (err, doc){
      if (err) {
        res.status(500).json({message: 'Server error', success: false});
        return;
      }
      if (doc) {
        if (doc.user.toString() === req.currentUser._id.toString()) {
          doc.title = title;
          doc.save();
          let output = {
            id: doc.id,
            title: doc.title,
            path: doc.path,
            collectionId: doc.collectionId,
            isThumbnail: doc.isThumbnail
          };
          res.status(200).json(output);
        } else {
          res.status(401).json({message: 'Access denied', success: false})
        }
      } else {
        res.status(404).json({message: 'No such image', success: false});
      }
    });
  } else {
    res.status(400).json({message: 'Title field is required', success: false});
  }
});

module.exports = router;
