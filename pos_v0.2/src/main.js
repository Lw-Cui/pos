//TODO: Please write code in this file.
function printInventory(inputs) {
    var info =
       {
           'ITEM000000':
            {
                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00
            },
           'ITEM000001':
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00
            },
           'ITEM000004':
            {
                barcode: 'ITEM000004',
                name: '电池',
                unit: '个',
                price: 2.00
            }
       };
    var data = [];
    for (var i = 0; i < inputs.length; i++)
        data.push(info[inputs[i]]);

    var dict = Cal(data);
    var form = CreateForm(dict);
    console.log(form);
}
function Cal(data) {
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

function CreateForm(dict) {
    var form =
        '名称：{{ name }}，数量：{{ count }}{{ unit }}，单价：{{ prices }}(元)，小计：{{ sum }}(元)\n';
    var forms = '';
    for (var i = 0; i < dict.length; i++) {
        dict[i].sum = function () {
            return (dict[i].price * dict[i].count).toFixed(2);
        };
        dict[i].prices = function () {
            return dict[i].price.toFixed(2);
        };
        forms += Mustache.render(form, dict[i]);
    }

    dict.sum_cost =
        function() {
            var sum = 0;
            for (var i = 0; i < dict.length; i++)
                sum += dict[i].price * dict[i].count;
            return sum.toFixed(2);
        };
    var output = Mustache.render(
        '***<没钱赚商店>购物清单***\n' +
        forms +
        '----------------------\n' +
        '总计：{{ sum_cost }}(元)\n' +
        '**********************', dict
    );
    return output;
}
