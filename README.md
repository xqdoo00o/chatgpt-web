# chatgpt-web
Pure javascript ChatGPT demo based on nginx with OpenAI API (gpt-3.5-turbo)

参考项目: 
[markdown-it-copy](https://github.com/ReAlign/markdown-it-copy)

[chatgpt-html](https://github.com/slippersheepig/chatgpt-html)


![示例](https://github.com/xqdoo00o/chatgpt-web/blob/main/example.png)
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