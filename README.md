# chatgpt-web
Pure javascript ChatGPT demo based on nginx with OpenAI API (gpt-3.5-turbo)

参考项目: 

[markdown-it](https://github.com/markdown-it/markdown-it)

[highlight.js](https://github.com/highlightjs/highlight.js)

[github-markdown-css](https://github.com/sindresorhus/github-markdown-css)

[chatgpt-html](https://github.com/slippersheepig/chatgpt-html)

[markdown-it-copy](https://github.com/ReAlign/markdown-it-copy)

[markdown-it-texmath](https://github.com/goessner/markdown-it-texmath)

![示例](https://github.com/xqdoo00o/chatgpt-web/blob/main/example.png)

## 可用配置

1. 允许长回复，默认关闭，开启方式：修改HTML中`const enableLongReply = false;`的`false`为`true`，开启后可能导致api费用增加，对于部分要发送`继续`才完整的超长回复，不用发`继续`了。

## 使用方法
需要配合nginx反代使用, 示例配置如下
```
location ^~ /v1 {
    proxy_pass https://api.openai.com;
    proxy_set_header Host api.openai.com;
    proxy_set_header  Authorization "Bearer 替换为API KEY";
    proxy_pass_header Authorization;
}
location / {
    root /usr/share/nginx/html;
    index chatgpt.html;
}
```
注意: 反代服务器需正常访问api.openai.com

如果无法正常访问, 可配合socat反代和http代理使用, 示例配置如下
```
location ^~ /v1 {
    proxy_pass https://127.0.0.1:8443;
    proxy_set_header Host api.openai.com;
    proxy_set_header  Authorization "Bearer 替换为API KEY";
    proxy_pass_header Authorization;
}
location / {
    root /usr/share/nginx/html;
    index chatgpt.html;
}
```
```
socat TCP4-LISTEN:8443,reuseaddr,fork PROXY:http代理地址:api.openai.com:443,proxyport=http代理端口
```