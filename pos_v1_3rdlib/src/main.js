function printInventory(inputs) {
    var info = ItemsInfo(loadAllItems());
    var shopping_barcode = GetShoppingBarcode(inputs);
    var shopping_list = GetShoppingList(shopping_barcode, info);

    var discount_barcode = loadPromotions()[0].barcodes;
    var discount_list = GetDiscountList(discount_barcode, shopping_list);

    var outputs = CreateForm(shopping_list, discount_list);
    console.log(outputs);
}

function ItemsInfo(raw_data) {
    return _.object(_.pluck(raw_data, 'barcode'), raw_data);
}

function GetDiscountList(discount_barcode, shopping_list) {
    return _.reduce(shopping_list, function(discount_list, item, property) {
        if (property in _.countBy(discount_barcode) && item.count > 2) {
            discount_list[property] = _.clone(item);
            discount_list[property].count = 1;
            item.discount = true;
        } else {
            item.discount = false;
        }
        return discount_list;
    }, {});
}

function GetShoppingList(shopping_barcode, info) {
    return _.reduce(shopping_barcode, function (shopping_list, barcode) {
        if (barcode in shopping_list) {
            shopping_list[barcode].count++;
        } else {
            shopping_list[barcode] = _.clone(info[barcode]);
            shopping_list[barcode].count = 1;
        }
        return shopping_list;
    }, {});
}

function GetShoppingBarcode(inputs) {
    var partten = /^(\w+)+-+(\d+)$/i;
    return _.reduce(inputs, function (data, barcode) {
        if (partten.test(barcode)) {
            var group = barcode.match(partten);
            for (var count = 0; count < group[2]; count++)
                data.push(group[1]);
        } else {
            data.push(barcode);
        }
        return data;
    }, []);
}

function ShoppingCost(shopping_list) {
    return _.reduce(shopping_list, function(sum, item) {
        if (item.discount)
            sum += (item.count - 1) * item.price;
        else
            sum += item.count * item.price;
        return sum;
    }, 0);
}

function DiscountSave(discount_list) {
    return _.reduce(discount_list, function(sum, item) {
        sum += item.price;
        return sum;
    }, 0);
}

function CreateForm(shopping_list, promote_list) {
    var form = '名称：{{ name }}，数量：{{ count }}{{ unit }}，单价：{{ prices }}(元)，小计：{{ sum }}(元)\n';
    var forms = Generator(form, shopping_list);

    var promote = '名称：{{ name }}，数量：{{ count }}{{ unit }}\n';
    var promotes = Generator(promote, promote_list);

    var output =
        '***<没钱赚商店>购物清单***\n' +
        forms +
        '----------------------\n挥泪赠送商品：\n' +
        promotes +
        '----------------------\n' +
        '总计：' + ShoppingCost(shopping_list).toFixed(2) + '(元)\n' +
        '节省：' + DiscountSave(promote_list).toFixed(2) + '(元)\n' +
        '**********************';
    return output;
}

function Generator(template, list) {
    return _.reduce(list, function (result, item) {
        item.sum = function () {
            if (item.discount)
                return ((item.count - 1) * item.price).toFixed(2);
            else
                return (item.price * item.count).toFixed(2);
        };
        item.prices = function () {
            return item.price.toFixed(2);
        };
        result += Mustache.render(template, item);
        return result;
    }, '');
}
