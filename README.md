# chatgpt-web
Pure javascript ChatGPT demo based on nginx with OpenAI API (gpt-3.5-turbo)

参考项目: 

[markdown-it](https://github.com/markdown-it/markdown-it)

[highlight.js](https://github.com/highlightjs/highlight.js)

[github-markdown-css](https://github.com/sindresorhus/github-markdown-css)

[chatgpt-html](https://github.com/slippersheepig/chatgpt-html)

[markdown-it-copy](https://github.com/ReAlign/markdown-it-copy)

[markdown-it-texmath](https://github.com/goessner/markdown-it-texmath)

[awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)

![示例](https://github.com/xqdoo00o/chatgpt-web/blob/main/example.png)

## 可用配置

1. 可选API key，默认不设置，如需使用，建议Nginx一定要配置https，公网以http方式明文传输API key极易被中间人截获。

2. 可选系统角色，默认不设置，可在设置里开启，有两个预设角色，并动态加载[awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)中的角色。

3. 可选角色性格，默认灵活创新，对应接口文档的top_p参数。

4. 可选回答质量，默认平衡，对应接口文档的temperature参数。

5. 修改打字机速度，值越大速度越快。

6. 允许连续对话，默认开启，对话中包含上下文信息。

7. 允许长回复，默认关闭，开启后可能导致api费用增加，并丢失部分上下文，对于一些要发送`继续`才完整的回复，不用发`继续`了。

## 使用方法
1. 需要配合nginx反代使用, 示例配置如下
```
location ^~ /v1 {
    proxy_pass https://api.openai.com;
    proxy_set_header Host api.openai.com;
    #如需用户自定义API key，可注释掉下一行配置
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
    #如需用户自定义API key，可注释掉下一行配置
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

1. 配合Caddy使用，可以自动生产HTTPS证书
```
yourdomain.example.com {
	reverse_proxy /v1/* https://api.openai.com {
		header_up Host api.openai.com
		header_up Authorization "{http.request.header.Authorization}"
		header_up Authorization "Bearer sk-your-token"
	}

	file_server / {
		root /var/wwwroot/chatgpt-web
		index chatgpt.html
	}
}

```