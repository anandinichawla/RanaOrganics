module.exports = function Cart(oldCart){
    this.items = oldCart.items || {}; 
    this.totalQty = oldCart.totalQty || 0 ; 
    this.totalPrice = oldCart.totalPrice || 0; 
    
    this.add = function(item, id){
          let storedItem = this.items[id]; 
          if(!storedItem){
              storedItem = this.items[id] = {item: item, qty:0, price: 0}; 
          }
          storedItem.qty++; 
          storedItem.price = storedItem.item.price * storedItem.qty; 
          this.totalQty++; 
        //   console.log()
          this.totalPrice += (storedItem.item.price*1); 
          console.log("totalPrice is = " + this.totalPrice);

    }

    this.deleteItem = function(id){

        console.log("I have ID = " + id);
        this.totalQty -= this.items[id].qty; 
        this.totalPrice -= this.items[id].price; 
        delete this.items[id];
    }

    this.generateArray = function() {
        let itemsArr = []; 
        for( let id in this.items){
            itemsArr.push(this.items[id]); 
        }
        return itemsArr; 
    }; 
}; 