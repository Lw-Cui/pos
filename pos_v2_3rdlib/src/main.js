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
    return _.reduce(raw_data, function(info, item) {
        info[item.get_barcode()] = _.clone(item);
        return info;
    }, {});
}

function GetDiscountList(discount_barcode, shopping_list) {
    return _.reduce(shopping_list, function(discount_list, item, property) {
        if (property in _.countBy(discount_barcode) && item.get_count() > 1) {
            discount_list[property] =
                new DiscountItem(item.get_barcode(), item.get_name(), item.get_unit(), Number(item.get_price()));
            item.set_discount();
            discount_list[property].set_count(1);
        }
        return discount_list;
    }, {});
}

function GetShoppingList(shopping_barcode, info) {
    return _.reduce(shopping_barcode, function (shopping_list, barcode) {
        if (barcode in shopping_list) {
            var item = shopping_list[barcode];
            item.set_count(item.get_count() + 1);
        } else {
            shopping_list[barcode] = _.clone(info[barcode]);
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
        sum += Number(item.get_cost());
        return sum;
    }, 0);
}

function DiscountSave(discount_list) {
    return _.reduce(discount_list, function(sum, item) {
        sum += Number(item.get_cost());
        return sum;
    }, 0);
}

function CreateForm(shopping_list, promote_list) {
    var form = '名称：{{ get_name }}，数量：{{ get_count }}{{ get_unit }}，单价：{{ get_price }}(元)，小计：{{ get_cost }}(元)\n';
    var forms = Generator(form, shopping_list);

    var promote = '名称：{{ get_name }}，数量：{{ get_count }}{{ get_unit }}\n';
    var promotes = Generator(promote, promote_list);

    var dateDigitToString = function (num) {
        return num < 10 ? '0' + num : num;
    };

    var currentDate = new Date(),
        year = dateDigitToString(currentDate.getFullYear()),
        month = dateDigitToString(currentDate.getMonth() + 1),
        date = dateDigitToString(currentDate.getDate()),
        hour = dateDigitToString(currentDate.getHours()),
        minute = dateDigitToString(currentDate.getMinutes()),
        second = dateDigitToString(currentDate.getSeconds()),
        formattedDateString = year + '年' + month + '月' + date + '日 ' + hour + ':' + minute + ':' + second;

    var output =
        '***<没钱赚商店>购物清单***\n' +
        '打印时间：' + formattedDateString + '\n' +
        '----------------------\n' +
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
        result += Mustache.render(template, item);
        return result;
    }, '');
}
