function ShoppingItem(barcode, name, unit, price) {
    this.barcode = barcode;
    this.name = name;
    this.unit = unit;
    this.price = price || 0.00;
    this.count = 1;
    this.discount = false;
}


ShoppingItem.prototype.get_unit = function() {
    return this.unit;
};


ShoppingItem.prototype.get_name = function() {
    return this.name;
};

ShoppingItem.prototype.set_count = function(num) {
    this.count = num;
};


ShoppingItem.prototype.set_discount = function() {
    this.discount = true;
};


ShoppingItem.prototype.get_count = function() {
    return this.count;
};


ShoppingItem.prototype.get_cost = function() {
    return (this.count * this.price).toFixed(2);
};


ShoppingItem.prototype.get_price = function() {
    return this.price.toFixed(2);
};


ShoppingItem.prototype.get_barcode = function() {
    return this.barcode;
};

ShoppingItem.prototype.get_cost = function() {
    if (this.discount)
        return ((this.count - 1) * this.price).toFixed(2);
    else
        return (this.count * this.price).toFixed(2);
};


function DiscountItem(barcode, name, unit, price) {
    ShoppingItem.call(this, barcode, name, unit, price);
}

DiscountItem.prototype = ShoppingItem.prototype;
/*
var ancestor = function(){};
ancestor.prototype = ShoppingItem.prototype;
DiscountItem.prototype = new ancestor();
DiscountItem.prototype.constructor = DiscountItem;
*/
