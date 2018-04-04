## 数据模拟服务

### 使用
+ 创建一个数据模拟服务的目录
+ 在改目录下打开命令终端
+ 执行`mo [--port 8000]`
+ 根据资源地址创建对应的文件，如：/x/xx/xxx/xxxx对应的文件为为/x/xx-xxx-xxxx.js，第一个目录通常作为工程名，之后的为接口地址使用'-'连接，再加上.js后缀
+ 接口地址后缀兼容：如x/xx.json按优先级命中/x/xx.json.js,/x/xx.js
+ 编辑该文件，输入基础内容：

```javascript
module.exports = function (res) {
    res.send(JSON.stringify({
        // ....data here
    }));
};
```

### 命令参数说明

+ --port 自定义端口号
+ --https 使用https默认使用http
 
 
### 内置数据生成器（gener）

目的为了能够更简单快速的生成页面开发需要的模拟数据

#### 示例
```javascript
module.exports = function (res) {
    res.send(JSON.stringify({
        status:"ok",
        data:{
            pageIndex:1,
            pageSize:10,
            total:gener.number(3,5),
            data:gener.array(10,function() {
                return {
                    id:gener.uid(),
                    userName:gener.string(5,10),
                    email:gener.email(),
                    mobile:gener.string(11,'no'),
                    sex:gener.random([0,1]),
                    realName:gener.string(2,3)
                }
            })
        }
    }));
};
```

#### 包含的生成方法

方法名为了更容易使用支持简拼

+ 数组 `a|array([minCount],maxCount,itemCreator)`
```javascript
var data = gener.array(2, function () {
    return {
        id: gener.uid()
    }
});
console.log(data);
````
+ 字符串 `s|string([minLength],maxLength,[type])` type默认"zh"中文，"en"为纯字母,"no"纯数字
```javascript
var data = gener.string(5);
console.log(data);
var data = gener.string(5,10);
console.log(data);
var data = gener.string(5,10,'no');
console.log(data);
````
+ 数值 `n|number([min,]max,[type],[addition])` type默认"i"整形,"f"浮点还可跟小数点位数默认2位
```javascript
var data = gener.number(10,20);
// var data = gener.number(10);
// var data = gener.number(10,20,'f');
// var data = gener.number(10,'f');
console.log(data);
````
+ 随机 `r|random(itemArray)` 
```javascript
var data = gener.random(["1","2"]);
console.log(data);
````
+ 邮箱 `e|email()`
```javascript
var data = gener.email();
console.log(data);
````
+ 时间戳 `t|timestamp([type])` 默认精确到毫秒,type为"s"精确到秒
```javascript
var data = gener.timestamp();
console.log(data);
var data = gener.timestamp('s');
console.log(data);
````
+ 日期时间 `d|datetime([format])` 默认格式
```javascript
var data = gener.datetime();
console.log(data);
var data = gener.datetime('yyyy-MM-dd hh:mm:ss S');
console.log(data);
````
+ 全局ID `u|uid()` 
```javascript
var data = gener.uid();
console.log(data);
````
+ 树形结构数据 `tree(options)` 
```javascript
var data = gener.tree({
    // id 使用自然数 否 使用uid
    //idIsNum: true,
    // 节点字段名
    //idKey: 'id',
    // 父节点字段名
    //pidKey: 'pid',
    // 树的层级
    //layer: 3,
    // 当前层级的节点数量
    //count: function (layer) {
    //    return [32, 16, 8][layer];
    //},
    // 额外数据
    //data: function (item,layer,pid) {
    //    item['name'] = gener.string(5);
    //}
});

console.log(data);
````

### 指定响应头部
```javacript
module.exports = function (res) {
    res.setHeader('Content-Type', 'text/html');
    res.send('1');
};
```

### 根据请求参数响应数据
```javacript
module.exports = function (res,req) {
    res.send(req.query.type == 'man' ? 1 : 0);
};
```
注：`req.query`存放的是资源地址带的参数；`req.body`存放的是POST提交的参数。

> 更多查看文档(https://nodejs.org/api/http.html#http_class_http_serverresponse)

