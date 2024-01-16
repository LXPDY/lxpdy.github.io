# 【WIP】Kokomi App

## 简介

基于Flutter开发的跨平台战舰世界战绩查询App

使用[Kokomi API](http://www.wows-coral.com:443/docs#/%E7%94%A8%E6%88%B7%E5%9F%BA%E6%9C%AC%E6%95%B0%E6%8D%AE%E6%8E%A5%E5%8F%A3/user_basic_user_info__get)进行数据支持

现阶段处于设计以及技术实验中。

# 技术实现

## .dart - Http请求以及返回实验

```dart
void request() async {
  setState(() {
    _loading = true;
    _text = "正在请求...";
  });
  try {
    // 发送GET请求
    final response = await http.get(Uri.parse("http://sample.com"));
    // 读取响应内容
    _text = response.body;
  } catch (e) {
    _text = "请求失败：$e";
  } finally {
    setState(() {
      _loading = false;
    });
  }
}
```

基于以上函数可以发送http请求，但是无法使得web App正确运行，通过调查可能是因为CORS（跨来源资源共享）策略所导致的。在Web环境下，浏览器会对跨域请求进行限制，而在iOS或Android应用中则不存在这种限制。
