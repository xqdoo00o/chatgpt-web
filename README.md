# chatgpt-web
Pure Javascript ChatGPT demo based on nginx with OpenAI API (gpt-3.5-turbo)

纯JS实现的ChatGPT项目，基于nginx和OpenAI gpt-3.5-turbo API.

部署一个HTML文件，配合nginx反代即可使用。

支持复制，刷新，语音输入，朗读等功能，以及众多[自定义选项](#自定义选项)。

参考项目: 
[markdown-it](https://github.com/markdown-it/markdown-it), 
[highlight.js](https://github.com/highlightjs/highlight.js), 
[github-markdown-css](https://github.com/sindresorhus/github-markdown-css), 
[chatgpt-html](https://github.com/slippersheepig/chatgpt-html), 
[markdown-it-copy](https://github.com/ReAlign/markdown-it-copy), 
[markdown-it-texmath](https://github.com/goessner/markdown-it-texmath), 
[awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)

![示例](https://github.com/xqdoo00o/chatgpt-web/blob/main/example.png)

## Demo

[在线预览](https://xqdoo00o.github.io/chatgpt-web/) （使用需配置自定义API key，可正常访问`api.openai.com`）

## 使用方法
### **注意：反代服务器需要正常访问`api.openai.com`**
1. 配合nginx反代使用, 示例配置如下
```
#开启openai接口的gzip压缩，大量重复文本的压缩率高，节省服务端流量
gzip  on;
gzip_min_length 1k;
gzip_types text/event-stream;

#如需部署在网站子路径，如/chatgpt，配置如下
#location ^~ /chatgpt/v1 {
location ^~ /v1 {
    proxy_pass https://api.openai.com/v1;
    proxy_set_header Host api.openai.com;
    #如需用户自定义API key，可注释掉下一行配置
    proxy_set_header  Authorization "Bearer 替换为API KEY";
    proxy_pass_header Authorization;
    #流式传输，不关闭buffering缓存会卡顿卡死，必须配置！！！
    proxy_buffering off;
}
#与上面反代接口的路径保持一致
#location /chatgpt {
location / {
    alias /usr/share/nginx/html/;
    index index.html;
}
```

如果服务器无法正常访问`api.openai.com`, 可配合socat反代和http代理使用，proxy_pass配置改成
```
    proxy_pass https://127.0.0.1:8443/v1;
```
并打开socat
```
socat TCP4-LISTEN:8443,reuseaddr,fork PROXY:http代理地址:api.openai.com:443,proxyport=http代理端口
```

2. 配合Caddy使用，可以自动生产HTTPS证书
```
yourdomain.example.com {
	reverse_proxy /v1/* https://api.openai.com {
		header_up Host api.openai.com
		header_up Authorization "{http.request.header.Authorization}"
		header_up Authorization "Bearer sk-your-token"
	}

	file_server / {
		root /var/wwwroot/chatgpt-web
		index index.html
	}
}

```

## 自定义选项

1. 可选API key，默认不设置，如需使用，建议Nginx一定要配置https，公网以http方式明文传输API key极易被中间人截获。

2. 可选系统角色，默认不开启，有三个预设角色，并动态加载[awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)中的角色。

3. 可选角色性格，默认灵活创新，对应接口文档的top_p参数。

4. 可选回答质量，默认平衡，对应接口文档的temperature参数。

5. 修改打字机速度，默认较快，值越大速度越快。

6. 允许连续对话，默认开启，对话中包含上下文信息，会导致api费用增加。

7. 允许长回复，默认关闭，开启后可能导致api费用增加，并丢失大部分上下文，对于一些要发送`继续`才完整的回复，不用发`继续`了。

8. 选择语音，默认Bing语音，不可用则使用本地语音，可分开设置提问语音和回答语音。

9. 音量，默认最大。

10. 语速，默认正常。

11. 音调，默认正常。

12. 允许连续朗读，默认开启，连续郎读到所有对话结束。

13. 允许自动朗读，默认关闭，自动朗读新的回答。

14. 支持语音输入，默认识别为普通话，可长按修改语音识别选项。如浏览器不支持语音输入，则不显示语音按钮（HTTPS+Edge浏览器体验最佳）。如点击语音按钮没反应，则未允许麦克风权限，或者没安装麦克风设备。