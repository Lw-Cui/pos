function printInventory(inputs) {
    var ItemList = loadAllItems();
    var info = {};
    for (var i = 0; i < ItemList.length; i++)
        info[ItemList[i].barcode] = ItemList[i];

    var shopping_item = FullList(info, inputs);

    var promote_info = GetPromoteInfo(info, loadPromotions()[0].barcodes);
    var promote_item = FullList(info, PromoteList(promote_info, inputs));

    var result = CreateForm(shopping_item, promote_item);
    console.log(result);
}


function GetPromoteInfo(info, promote_item) {
    var promote_info = {};
    for (var i = 0; i < promote_item.length; i++)
        promote_info[promote_item[i]] = info[promote_item[i]];
    return promote_info;
}



function PromoteList(info, inputs) {
    var copy = {};
    for (var i = 0; i < inputs.length; i++)
        if (inputs[i] in info) {
            if (inputs[i] in copy)
                copy[inputs[i]]++;
            else
                copy[inputs[i]] = 1;
        }
    var list = [];
    for (var property in copy)
        for (var i = Math.floor(copy[property] / 2); i > 0; i--)
            list.push(property);
    return list;
}




/*
    convert inputs:
        ['ITEM000003-2']
    to data:
        {
            'ITEM000003': {barode:'ITEM000003', name: 'xxx'},
            'ITEM000003': {barode:'ITEM000003', name: 'xxx'}
         }
 */
function FullList(info, inputs) {
    var data = [];
    var partten = /^ITEM+(\d+)+-+(\d+)$/i;
    for (var i = 0; i < inputs.length; i++)
        if (!(inputs[i] in data)) {
            if (partten.test(inputs[i])) {
                var group = inputs[i].match(partten);
                for (var count = 0; count < group[2]; count++)
                    data.push(info['ITEM' + group[1]]);
            } else {
                data.push(info[inputs[i]]);
            }
        }

    return data;
}



/*
    convert data:
         {
         'ITEM000003': {barode:'ITEM000003', name: 'xxx'},
         'ITEM000003': {barode:'ITEM000003', name: 'xxx'}
         }
     to dict:
        {
         'ITEM000003': {barode:'ITEM000003', name: 'xxx', count = 2}
        }
 */
function merge(data) {
    var list = {};
    for (var i = 0; i < data.length; i++) {
        var barcode = data[i].barcode;
        if (barcode in list)
            list[barcode]++;
        else
            list[barcode] = 1;
    }
    var dict = [];
    for (var i = 0; i < data.length; i++) {
        var barcode = data[i].barcode;
        if (list[barcode] > 0) {
            data[i].count = list[barcode];
            list[barcode] = 0;
            dict.push(data[i]);
        }
    }
    return dict;
}


/*
    generate formatted form using template
 */
function Generator(template, param) {
    var result = '';
    for (var i = 0; i < param.length; i++) {
        param[i].sum = function() {
            return (param[i].price * param[i].count).toFixed(2);
        };
        param[i].prices = function() {
            return param[i].price.toFixed(2);
        };
        result += Mustache.render(template, param[i]);
    }
    return result;
}


/*
    get sum cost
 */
function Sum(dict) {
    var sum = 0;
    for (var i = 0; i < dict.length; i++)
        sum += dict[i].price;
    return sum.toFixed(2);
}


/*
    create the final form
 */
function CreateForm(shopping_item, promote_item) {
    var form = '名称：{{ name }}，数量：{{ count }}{{ unit }}，单价：{{ prices }}(元)，小计：{{ sum }}(元)\n';
    var forms = Generator(form, merge(shopping_item));

    var promote = '名称：{{ name }}，数量：{{ count }}{{ unit }}\n';
    var promotes = Generator(promote, merge(promote_item));

    var output =
        '***<没钱赚商店>购物清单***\n' +
        forms +
        '----------------------\n挥泪赠送商品：\n' +
        promotes +
        '----------------------\n' +
        '总计：' + Sum(shopping_item) + '(元)\n' +
        '节省：' + Sum(promote_item) + '(元)\n' +
        '**********************';
    return output;
}

