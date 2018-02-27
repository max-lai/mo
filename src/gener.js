/**
 * Created by max on 2017/3/7.
 */
require('./date_extend');
var _zhWords = "的一是了我不人在他有这个上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学么之都好看起发当没成只如事把还用第样道想作种开美总从无情己面最女但现前些所同日手又行意动方期它头经长儿回位分爱老因很给名法间斯知世什两次使身者被高已亲其进此话常与活正感见明问力理尔点文几定本公特做外孩相西果走将月十实向声车全信重三机工物气每并别真打太新比才便夫再书部水像眼等体却加电主界门";
var _enWords = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var _numWords = "0123456789";

//自动生成辅助
module.exports = {
    "array": function (/*[minCount],maxCount,itemCreator*/) {
        var arr = [];
        var count = arguments.length == 3 ? arguments[0] + Math.random() * (arguments[1] - arguments[0]) : arguments[0];
        var fnc = arguments.length == 3 ? arguments[2] : arguments[1];
        for (var i = 0.5; i < count; i++) {
            arr.push(fnc());
        }
        return arr;
    },
    "a": function () {
        return this.array.apply(this, arguments);
    },
    //唯一资源ID
    "uid": function () {
        var g = [];
        var i = 32;
        while (i--) {
            g.push(Math.floor(Math.random() * 16.0).toString(16));
        }
        return g.join("");
    },
    "u": function () {
        return this.uid.apply(this, arguments);
    },
    //随机字符串
    "string": function (/*[minLength],maxLength,[type]*/) {
        var arr = [];
        var words = [];
        if (arguments[arguments.length - 1] == "en") {
            words = _enWords;
            var count = arguments.length > 2 ? arguments[0] + Math.random() * (arguments[1] - arguments[0]) : arguments[0];
        } else if (arguments[arguments.length - 1] == "no") {
            words = _numWords;
            var count = arguments.length > 2 ? arguments[0] + Math.random() * (arguments[1] - arguments[0]) : arguments[0];
        } else {
            words = _zhWords;
            var count = arguments.length > 1 ? arguments[0] + Math.random() * (arguments[1] - arguments[0]) : arguments[0];
        }
        for (var i = 0; i < count; i++) {
            arr.push(words[Math.floor(Math.random() * words.length)]);
        }
        return arr.join('');
    },
    "s": function () {
        return this.string.apply(this, arguments);
    },
    //随机数字
    "number": function (/*[min,]max,[type],[addition]*/) {
        if (arguments[1] === 'f' || arguments[2] === 'f') {
            var i = arguments[1] === 'f' ? 2 : 3;
            //浮点
            var v = i > 2 ? arguments[0] + Math.random() * (arguments[1] - arguments[0]) : Math.random() * arguments[0];
            return v.toFixed(arguments[i] || 2);
        } else {
            //整形
            var v = arguments.length > 1 ? arguments[0] + Math.random() * (arguments[1] - arguments[0]) : Math.random() * arguments[0];
            return Math.round(v);
        }
    },
    "n": function () {
        return this.number.apply(this, arguments);
    },
    //随机
    "random": function (items) {
        return items[Math.round(Math.random() * (items.length - 1))];
    },
    "r": function () {
        return this.random.apply(this, arguments);
    },
    //时间戳
    "timestamp": function (type) {
        return type == "s" ? Math.round(new Date().getTime() / 1000) : new Date().getTime();
    },
    "t": function () {
        return this.timestamp.apply(this, arguments);
    },
    //日期时间
    "datetime": function (format) {
        format = format || 'yyyy-MM-dd hh:mm:ss';
        return new Date().setByStr('+' + Math.round(Math.random() * 30) + 'day').format(format);
    },
    "d": function () {
        return this.datetime.apply(this, arguments);
    },
    //邮箱
    "email": function () {
        return this["string"](5, 12, 'en') + '@' + 'example.com';
    },
    "e": function () {
        return this.email.apply(this, arguments);
    },
    //树形结构生成器
    "tree": function (options) {
        var _this = this;
        options = options || {};
        //节点id名称
        options['idKey'] === undefined && (options['idKey'] = 'id');
        //父节点id名称
        options['pidKey'] === undefined && (options['pidKey'] = 'pid');
        //层级
        options['layer'] === undefined && (options['layer'] = 3);
        //层级的节点数量
        options['count'] === undefined && (options['count'] = function (layer) {
            return [16, 8, 4][layer];
        });
        //id使用自然数
        options['idIsNum'] === undefined && (options['idIsNum'] = true);
        //额外数据
        options['data'] === undefined && (options['data'] = function (item, layer, pid) {
            item['name'] = _this.string(5);
        });

        var data = [];

        var idNum = 0;

        function getId() {
            return options['idIsNum'] ? ++idNum : _this.uid();
        }

        function createTree(pid, layer) {
            for (var i = 0; i < options['count'](options['layer'] - layer); i++) {
                var item = {};
                item[options['idKey']] = getId();
                item[options['pidKey']] = pid;
                //额外数据
                options['data'](item, options['layer'] - layer, pid);
                data.push(item);
                if (layer > 1) {
                    createTree(item[options['idKey']], layer - 1);
                }
            }
        }

        createTree(options['idIsNum'] ? 0 : "", options['layer']);
        return data;
    }
};