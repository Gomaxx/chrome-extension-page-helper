# chrome-extension-page-helper
## 主要功能
* 给网页任意元素添加标注信息，生成元素标注数据
* 根据给定的元素标注数据回显信息

## 主要目的
针对前后端分离项目，降低前后端原型接口对接的复杂度，即使后端编写了相关接口的 API 文档，前端在对接接口时依然，无法明确确定应该调用那个接口，需要跟后端的同学进行沟通， 

* 后端编写的 API 文档，是说明接口怎么调用
* 该插件是用来标注原形功能应该调用哪个 API 接口

 
## 使用方法
### 标注数据
![](./标注元素.gif)
* 点击右上角 “X” 可以关闭标注界面
* 控制台输出的为“元素标注数据”
```json
{
  "//*[@id=\"s-top-left\"]/a[3]": "http://www.demo.com"
}
```
### 设置回显元素标注数据
![](./标注回显.gif)


#注意
<span style="font-weight: bold; color: red">采用 XPath 定位数据，如果页面结构发生大的结构变化会导致标注信息失效。</span>

# 参考
* https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html
* https://developer.mozilla.org/en-US/docs/Web/API/Document/elementFromPoint
* https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate
* https://www.cnblogs.com/hushaojun/p/6651491.html