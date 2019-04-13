
var fs = require('fs'); 
var path = require('path');

var app = express(); 

app.set('view engine', 'hbs'); 
app.use(express.urlencoded({extended: false})); 

const p = path.join(__dirname, 'public');
console.log(p);
app.use('/', express.static(p)); 

app.use(function(req, res, next){
	console.log(req.method, req.path, req.query); 
	next(); 
});

app.get('/', (req, res) => {
	res.render('index'); 
}); 

