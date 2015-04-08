# 文件内容的 web 资源探测器：webprobe
---

[![webprobe](https://nodei.co/npm/webprobe.png)](https://npmjs.org/package/webprobe)
[![NPM downloads](http://img.shields.io/npm/dm/webprobe.svg)](https://npmjs.org/package/webprobe)
[![Coverage Status](https://img.shields.io/coveralls/alvinhui/webprobe.svg)](https://coveralls.io/r/alvinhui/webprobe?branch=master)
[![node version](https://img.shields.io/badge/node.js-%3E=_0.12-green.svg?style=flat-square)](http://nodejs.org/download/)


文件内容的 web 资源探测器，根据规则匹配文件内的 web 资源，然后探测资源是否可访问、其内容是否存在某些关键字。

可用在 https 改造中，例如：匹配模板内通过 `<script src="">` 和 `<link href="">` 方式加载的资源，并检测该资源的源码内是否存在 `http://` 关键字（如果存在则该资源有可能会发起 http 请求，所以该资源需要改造）

## 安装

安装 webprobe

```
$ sudo npm install -g webprobe
```

## 使用

### 当前目录运行

```
$ webprobe
```

会以当前目录为根目录，递归遍历并查找所有以 `<script src="">` 和 `<link href="">` 方式加载的资源，并进行 `http://` 关键字的探测（如果该文件内存在则会进行记录）

默认查找的文件后缀是：```types = ['vm', 'html', 'xtpl', 'php'];```

### 通过配置文件运行

#### 配置文件示例1：

```
module.exports = {

	//需要遍历的目录列表，绝对路径
	dirs: [
		'/github/dir1',
		'/github/dir1'
	],

	//需要查找并进行正则匹配的文件后缀，如果不指定，则用默认文件类型
	types: ['html', 'xtpl']
};
```

将上面内容保存为config.js，运行：

```
$ webprobe config.js
```

**更多配置项，请参考 [config.js]**

#### 配置文件示例2，多个独立的配置：

```
module.exports = [
	{
		dirs: [
			'/github/dir1'
		],
		types: ['vm', 'html']
	},
	{
		dirs: [
			'/github/dir2'
		],
		types: ['xtpl', 'php'],

		//可以不设置charset选项，会使用jscharset自动检测每个文件的编码
		charset: 'gbk'
	}
];
```

将上面内容保存为config.js，运行：

```
$ webprobe config.js
```

**更多用法，请参考 [config2.js]**

`注意：`如果没有指定charset参数，将会用 [jscharset] 模块自动检查文件编码

### 报告

程序最后会在控制台输出运行报告，报告内容采用 markdown 语法，最后的显示如 **[report.md]** 所示。

为了获得更佳的阅读体验，推荐将输出结果保存入文件然后用 markdown 可视化工具打开：

```
$ webprobe > report.md
```

#### 自定义格式

你可以把 webprobe 安装到本地目录，然后自己调用 run 方法得到 report 对象，进行自定义输出：

```
$ tnpm install webprobe
$ touch index.js
$ vim index.js
```

index.js：

```
var webprobe = require('webprobe');
webprobe.run({
	dirs: [
		'/Users/alvin/Documents/www/ali/git/wuji/webprobe/test/demo'
	],
	types: ['vm', 'html'],
	ignores: [
		'ignoreme'
	],
	replaces: [
		{
			from: ['$!{uiModule}', '$!{guiModule}'],
			to: 'http://g.tbcdn.cn'
		}
	]
}, function(err, report){
	if(err) throw err;

	//show report logic
	//report = {
	//	errorURLs : [], // 所有错误的 URL
	//	ignoreURLs : [], // 所有忽略掉的 URL
	//	errorProbes: [], // 所有探测失败的 URL
	//	probeURLs : [], // 所有探测过的 URL
	//	allURLs: [] // 所有匹配到的 URL
	//}
});
```

## 高级用法

如 [config3.js] 所示，你可以自己指定匹配的正则和需要探测的内容。

例如，我需要匹配所有通过 `<test link="">` 加载的资源，并探测其内容中是否含有关键字 `KISSY`：

```
tags: [
	{
		name: 'Test',
		reg: /<test .*?link=(['"])(.*?)\1.*?>/g,
		match: function(response, body){
			return body.match(/KISSY/) ? true : false;
		}
	}
]
```

甚至是：匹配所有图片资源，找出大小大于 10kb 的图片（参考 [config4.js] 的配置和运行结果 [report4.md]）：

```
tags: [
	{
		name: 'Image',
		reg: /<img .*?src=(['"])(.*?)\1.*?>/g,
		match: function(response){
			return response.headers['content-length'] > 10000;
		}
	}
]
```

[jscharset]:https://www.npmjs.com/package/jschardet
[config.js]:./example/config.js
[config2.js]:./example/config2.js
[config3.js]:./example/config3.js
[config4.js]:./example/config4.js
[report.md]:./example/report.md
[report2.md]:./example/report2.md
[report3.md]:./example/report3.md
[report4.md]:./example/report4.md