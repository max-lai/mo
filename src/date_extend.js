/**
 * Date对象的扩展
 * Created by max.l on 2015/12/21.
 */

/**
 * 时间转换
 * @param format
 * @returns {*}
 */
Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

/**
 * 获取当天的23:59:59的时间戳
 * @param p [+-1month|+-1day|+-hour]
 * @returns {number}
 */
Date.prototype.getMaxTimestamp = function (p) {
    this.setByStr(p);
    return Math.round((new Date(this.format('yyyy/MM/dd 23:59:59'))).getTime() / 1000);
};

/**
 * 获取当天的00:00:00的时间戳
 * @param p [+-1month|+-1day|+-hour]
 * @returns {number}
 */
Date.prototype.getMinTimestamp = function (p) {
    this.setByStr(p);
    return Math.round((new Date(this.format('yyyy/MM/dd 00:00:00'))).getTime() / 1000);
};

/**
 * 获取时间戳
 * @param p [+-1month|+-1day|+-hour]
 * @returns {number}
 */
Date.prototype.getTimestamp = function (p) {
    this.setByStr(p);
    return Math.round(this.getTime() / 1000);
};

/**
 * 语义描述方式更改时间值
 * @param p [+-1month|+-1day|+-hour]
 */
Date.prototype.setByStr = function (p) {
    p = p || '';
    var matches = p.match(/^([+-]) *(\d+) *(\w+)$/);
    if (matches) {
        switch (matches[3]) {
            case "month":
                if (matches[1] == '+') {
                    var o = this.getMonth();
                    var n = o + parseInt(matches[2]);
                    this.setMonth(n);
                } else if (matches[1] == '-') {
                    var o = this.getMonth();
                    var n = o - parseInt(matches[2]);
                    this.setMonth(n);
                }
                break;
            case "day":
                if (matches[1] == '+') {
                    var o = this.getDate();
                    var n = o + parseInt(matches[2]);
                    this.setDate(n);
                } else if (matches[1] == '-') {
                    var o = this.getDate();
                    var n = o - parseInt(matches[2]);
                    this.setDate(n);
                }
                break;
            case "hour":
                if (matches[1] == '+') {
                    var o = this.getHours();
                    var n = o + parseInt(matches[2]);
                    this.setHours(n);
                } else if (matches[1] == '-') {
                    var o = this.getHours();
                    var n = o - parseInt(matches[2]);
                    this.setHours(n);
                }
                break;
        }
    }
    return this;
};