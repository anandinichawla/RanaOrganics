var Product = require('../models/product'); 
var mongoose = require('mongoose'); 

// mongoose.connect('mongodb://localhost/shopping', { useNewUrlParser: true }); 
var products = [
    
    new Product({
        image: '/images/trekMix.jpg',
        title: 'Trek Mix', 
        descr: 'nuts',
        price: 5
    }),
    new Product ({
        image: '/images/appleRings.jpeg',
            title: 'Apple Rings', 
            descr: 'apple rings',
            price: 7
    }),
    new Product ({
        image: '/images/bananaChips.jpg',
            title: 'Banana Chips', 
            descr: 'chips',
            price: 3
    }),

    new Product ({
        image: '/images/califMilk.jpg',
            title: 'Almond Milk Coffee', 
            descr: 'coffee',
            price: 4
    }),

    new Product ({
        image: '/images/carrotChips.jpg',
            title: 'Carrot Chips', 
            descr: 'chips',
            price: 3
    }),

    new Product ({
        image: '/images/doubleChips.jpeg',
            title: 'Chips Mega Pack', 
            descr: 'chips',
            price: 7
    }),

    new Product ({
        image: '/images/energyBites.jpg',
            title: 'Energy Bites', 
            descr: 'energy bites',
            price: 5
    }),

    new Product ({
        image: '/images/fruitBox.jpeg',
            title: 'Posh Fruit Box', 
            descr: 'fruit',
            price: 5
    }),

    new Product ({
        image: '/images/granolaBars.jpeg',
            title: 'Granola Bars', 
            descr: 'granola bars',
            price: 3 
    }),

    new Product ({
        image: '/images/greekyogurt.jpeg',
            title: 'Greek Yogurt', 
            descr: 'greek yogurt',
            price: 3
    }),

    new Product ({
        image: '/images/juice1.jpeg',
            title: 'Detox Juice', 
            descr: 'juice',
            price: 8
    }),

    new Product ({
        image: '/images/kaleJuice.jpg',
            title: 'Kale Juice', 
            descr: 'juice',
            price: 8
    }),

    new Product ({
        image: '/images/leanandgreen.png',
            title: 'Lean & Green', 
            descr: 'juice',
            price: 8 
    }),

    new Product ({
        image: '/images/megajuicepack.jpg',
            title: 'Mega Juice Pack', 
            descr: 'juice',
            price: 15 
    }),
    new Product ({
        image: '/images/megaSnack.jpg',
            title: 'Mega Veggie Pack', 
            descr: 'veggie pack',
            price: 20 
    }),
    new Product ({
        image: '/images/organicCoffee2.jpg',
            title: 'Organic Coffee', 
            descr: 'coffee',
            price: 5
    }), 
    new Product ({
        image: '/images/organicCoffee.jpg',
            title: 'Organic Coffee', 
            descr: 'coffee',
            price: 5 
    }),
    new Product ({
        image: '/images/organicCoffee3.png',
            title: 'Organic Coffee', 
            descr: 'coffee',
            price: 5 
    }),
    new Product ({
        image: '/images/parfait.png',
            title: 'Parfait', 
            descr: 'parfait',
            price: 6 
    }), 
    new Product ({
        image: '/images/veggieMix.jpg',
            title: 'Veggie Mix', 
            descr: 'veggie mix',
            price: 7 
    }),
    new Product ({
        image: '/images/veggiePack.jpg',
            title: 'Veggie Mega Pack', 
            descr: 'veggie mega pack',
            price: 15
    }),
    new Product ({
        image: '/images/zuchiniChips.jpg',
            title: 'Zuchini Chips', 
            descr: 'chips',
            price: 5
    })

];





for(var i = 0; i < products.length; i++){
    
    products[i].save((err, res) => {
        
        if(err){
            console.log('uh oh error on save to mongo');
        }
        else{
            
           
        }
 
    });
       


}
