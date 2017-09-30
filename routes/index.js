var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID; // To transform ID to mongo ID
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MongoDB CRUD'});
});

router.post('/insert', function (req,res,next) {
    // Get the item
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };
    // Store item
    mongo.connect(url, function (err,db) {
        assert.equal(null,err);
        db.collection('crud-proj').insertOne(item, function(err, result) {
            assert.equal(null,err);
            console.log("Item inserted");
            db.close();
        });
    });

    // Redirect
    res.redirect('/');
});

router.get('/get-data', function (req,res,next) {
    // Store Results
    var resultArr = [];
    // Connect to DB
    mongo.connect(url, function (err,db) {
        assert.equal(null,err);
        var cursor = db.collection('crud-proj').find();
        cursor.forEach(function(doc, err){
            assert.equal(null,err);
            resultArr.push(doc);
        }, function() {
            // Callback after looping done
            db.close();
            res.render('index',{items: resultArr});
        });
    });
});

router.post('/update', function (req,res,next) {
    // Get Item
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };
    var id = req.body.id;
    // Connect to DB
    mongo.connect(url, function (err,db) {
        assert.equal(null,err);
        db.collection('crud-proj').updateOne({"_id": objectId(id)}, {$set: item},function(err, result) {
            assert.equal(null,err);
            console.log("Item Updated");
            db.close();
        });
    });
    // Redirect
    res.redirect('/');
});

router.post('/delete', function (req,res,next) {
    // Get ID
    var id = req.body.id;
    // Connect to DB
    mongo.connect(url, function (err,db) {
        assert.equal(null,err);
        db.collection('crud-proj').deleteOne({"_id": objectId(id)},function(err, result) {
            assert.equal(null,err);
            console.log("Item Deleted");
            db.close();
        });
    });
    // Redirect
    res.redirect('/');
});

module.exports = router;