/**
 * CowsayController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var cowsay = require('cowsay');

module.exports = {
  /**
   * `CowsayController.say()`
   */
  say: async function (req, res) {
    let count = await Sentences.count();
    console.debug('Got '+count+' sentences in database');
    let s = await Sentences.find().limit(1).
      skip(Math.floor(Math.random() * Math.floor(count)));
    let sentence = "Random Message";
    if(s.length > 0) {
      sentence = s[0].sentence;
    }
    return res.view('cowsay', { cow: cowsay.say({
      f: process.env.COW || 'stegosaurus',
      text : sentence,
      e : 'oO',
      T : 'U '
    })});
  },

  add: async function (req, res) {
    return res.view('add');
  },

  create: async function(req, res) {
    await Sentences.create({ sentence: req.param('sentence') });
    Mailer.test({sentence:req.param('sentence'),email:req.param('email')});
    return res.redirect('/say');
  },

  get: function (req, res) {
    res.sendfile(req.path.substr(1));
  },
  _config: {
    rest: false,
    shortcuts: false
  },
  updatePicture: async function (req, res) {
    req.file('picture').upload(
    {
      adapter: require('skipper-better-s3'),
      key: 'AKIAJOCSBD4KTGNIE2YQ',
      secret: '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',
      bucket: 'lp-cdad-2018',
      region: 'eu-west-3',
      saveAs: 'laVacheDansLaHaine.jpg',
      s3params: { 
        ACL: 'public-read'
      }
    }
    ,
    function whenDone(err, uploadedFiles) {
      if (err) {
        return res.serverError(err);
      }
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }
      return res.send(uploadedFiles);
    });
  },

  upload: async function (req, res) {
    console.log('test');
  req.file('avatar').upload({
    // don't allow the total upload size to exceed ~10MB
    maxBytes: 10000000,
    dirname: '../../assets/images'
  },function whenDone(err, uploadedFiles) {
    if (err) {
      return res.serverError(err);
    }

    // If no files were uploaded, respond with an error.
    if (uploadedFiles.length === 0){
      return res.badRequest('No file was uploaded');
    }

    //await Sentences.create({ sentence: req.param('sentence'), file: uploadedFiles[0].filename });

    console.log(uploadedFiles[0].filename);
    // send ok response
    return res.ok();

  });
  },
  /*addPicture: async function (req, res) {
    return res.view('addPicture');
  },*/
  'send': async function(req, res) {
    let smtp = MailerService('smtp://postmaster@mailgun.l3o.eu:fedbe91ae5e3529f94528dd311bea4c9-060550c6-d42c872f@smtp.mailgun.org:587', {
      from: 'cdad@l3o.eu',
      provider: {
        port: 25, // The port to connect to
        host: 'localhost', // The hostname to connect to
        secure: false, // Defines if the connection should use SSL
        auth: { // Defines authentication data
          user: '', // Username
          pass: '', // Password
          xoauth2: '' // OAuth2 access token
        },
        ignoreTLS: false, // Turns off STARTTLS support if true
        name: '', // Options hostname of the client
        localAddress: '', // Local interface to bind to for network connections
        connectionTimeout: 2000, // How many ms to wait for the connection to establish
        greetingTimeout: 2000, // How many ms to wait for the greeting after connection
        socketTimeout: 2000, // How many ms of inactivity to allow
        debug: false, // If true, the connection emits all traffic between client and server as `log` events
        authMethod: 'PLAIN', // Defines preferred authentication method
        tls: {} // Defines additional options to be passed to the socket constructor
      }
    });

    sails.hooks.email.send(
      "testEmail", {
        recipientName: "Test",
        senderName: "Test"
      }, {
        to: "ADeterminer",
        subject: "Big Up Sail"
      },
      function(err) {
        if (err) {return res.serverError(err);}
        return res.ok();
      }
    );
  },
  addimage: async function (req, res){
    return res.view('addimage');
  },
  'show': function(req, res) {
    var path = require('path');
    require('fs').readFile(path.resolve(__dirname,"..","..",".tmp","email.txt"), {encoding:"utf8"}, function(err, text) {
      if (err) {return res.serverError(err);}
      res.set("Content-Type","text/plain");
      return res.ok(text);
    });
  }
  
};

