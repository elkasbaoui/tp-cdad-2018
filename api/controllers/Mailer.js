module.exports.test = function(obj) {
    sails.hooks.email.send(
    "sentence", 
    {
        Sentence: obj.sentence
    },
    {
        to: obj.email,
        subject: "Hello"
    },
    function(err) {console.log(err || "Bah oui logique!");}
    )
}