const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const UIDGenerator = require("uid-generator");
const uidgen = new UIDGenerator();
const passport = require("passport");
const compress_images = require("compress-images");

// importing db configurations
const dbconfig = require('../config/dbconfig');

// to generate unique token for each uploaded file
let token;
uidgen.generate().then(uid => (token = uid));

const Movie = require("../models/Movie");

const GridFsStorage = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url: dbconfig.dburl,
  file: (req, file) => {
    //console.log("file received", req.files)

    return {
      filename: req.body.name + path.extname(file.originalname)
      // metadata: {uploadedByUser: req.body.uploadedByUser, Description: req.body.Description, thumbnail: req.body.name + path.extname(file.originalname) }
    };
  }
});
const upload = multer({
  storage
});

// file upload url files/upload

router.post("/movies", upload.array("file", 2), (req, res) => {
  const movie = new Movie({
    MovieName: req.body.name,
    description: req.body.Description,
    category: req.body.Category,
    token: token,
    fileID: req.files[0].id,
    posterID: req.files[1].id,
    filename: req.files[0].filename,
    thumbnail: req.files[1].filename,
    uploadedDate: Date.now(),
    uploadedByUser: req.body.uploadedByUser,
    size: Math.round(req.files[0].size / 1000000)
  });
  console.log(movie);
  movie.save(function(err) {
    if (err) {
      console.log(err);
      return;
    }

    res.send({
      success: "true"
    });
  });
});

router.get("/movies", (req, res) => {
  Movie.find()
    .then(movies => {
      res.send(movies);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
