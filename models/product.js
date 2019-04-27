var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 

var productSchema = new Schema ({
    image: {type: String, 
            required: true},
    title: {type: String, 
        required: true},
    descr: {type: String, 
          required: true},
    price: {type: String, 
        required: true},
    
}); 
// mongoose.connect('mongodb://localhost/shopping', { useNewUrlParser: true }); 
module.exports = mongoose.model('Product',productSchema);

