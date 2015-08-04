//TODO: Please write code in this file.
function printInventory(inputs) {
    var form =
        '名称：{{ name }}，数量：{{ count }}{{ unit }}，单价：{{ prices }}(元)，小计：{{ sum }}(元)\n';
    var forms = '';
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].sum = function () {
            return (inputs[i].price * inputs[i].count).toFixed(2);
        };
        inputs[i].prices = function () {
            return inputs[i].price.toFixed(2);
        };
        forms += Mustache.render(form, inputs[i]);
    }

    inputs.sum_cost =
            function() {
            var sum = 0;
            for (var i = 0; i < inputs.length; i++)
                sum += inputs[i].price * inputs[i].count;
            return sum.toFixed(2);
        };
    var output = Mustache.render(
        '***<没钱赚商店>购物清单***\n' +
        forms +
        '----------------------\n' +
        '总计：{{ sum_cost }}(元)\n' +
        '**********************', inputs
    );
    alert(output);
    console.log(output);
}
