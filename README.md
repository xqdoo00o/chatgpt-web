# chatgpt-web-darkmode-and-other-upgrade
Added some useful features based on chatgpt-web

## 增加的功能
- 1.基于darkmode.js,增加了日夜模式的切换功能。

- 2.基于sweetalert2.js，增加了美观的弹出确认窗口。

- 3.基于html2canvas.js，增加了导出当前窗口截图，以及全部对话截图的功能。

- 4.导出功能增强：新增markdown格式以及TXT格式导出对话内容。

- 5.增加了滚动到顶部及底部的功能。


## 优化的功能
- 1.为了适配日夜模式，对整体样式做了适配，以更好的在日间和夜间良好的显示。
   - 1.1.取消不必要的色彩，整体以黑白灰为基础进行全面的修改。
   - 1.2.为了更鲜明的突出问答，用户的问题以黑底白字显示，文字处于中央；
       chatgpt的回答以白底黑字为主体，代码块增加边框以便区分。
   - 1.3.增加用户问题输入框边框以更好在黑夜模式下显示。
   - 1.4.停止chatgpt输出按钮，取消文字显示，做简化以及样式更改。
- 2.在chatgpt开始输出内容的时候，将画面滚动到最底部，以便实时观看内容。
  - （解决在页面内容过多时，重新进入页面时视窗会处于最顶端，输入问题后查看回答还需往下拉）

- 3.隐藏了语音输入功能，由于此功能存在较大的使用限制，
  且桌面及移动端设备自带的输入法已经具备了语音转文字功能，故做了隐藏，但代码做了保留。

### 界面截图
#### 日间样式
![daymode](https://raw.githubusercontent.com/TaiYouWeb/chatgpt-web-darkmode-and-other-upgrade/main/img/daymode.png)
#### 夜间样式
![nightmode](https://raw.githubusercontent.com/TaiYouWeb/chatgpt-web-darkmode-and-other-upgrade/main/img/nightmode.png)
#### 弹出框
![popupbox](https://raw.githubusercontent.com/TaiYouWeb/chatgpt-web-darkmode-and-other-upgrade/main/img/popupbox.png)







# 以下为原作者的readme。


纯JS实现的ChatGPT项目，基于OpenAI API

部署一个HTML文件即可使用。

支持复制，刷新，语音输入，朗读等功能，以及众多[自定义选项](#自定义选项)。

参考项目: 
[markdown-it](https://github.com/markdown-it/markdown-it), 
[highlight.js](https://github.com/highlightjs/highlight.js), 
[github-markdown-css](https://github.com/sindresorhus/github-markdown-css), 
[chatgpt-html](https://github.com/slippersheepig/chatgpt-html), 
[markdown-it-copy](https://github.com/ReAlign/markdown-it-copy), 
[markdown-it-texmath](https://github.com/goessner/markdown-it-texmath), 
[awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)

![示例](https://raw.githubusercontent.com/xqdoo00o/chatgpt-web/main/example.png)

## Demo

[在线预览](https://xqdoo00o.github.io/chatgpt-web/) （使用需配置自定义API key和自定义接口）

## 使用方法
### **注意：部署反代接口请注意OpenAI的[支持地区](https://platform.openai.com/docs/supported-countries)，部署在不支持地区的服务器可能导致封号！最好配置https，公网以http方式明文传输API key非常不安全！**
___
- **仅部署HTML**

    使用任意http server部署index.html。打开网页设置，填写自定义API Key，自定义接口，当本地

    - 可正常访问`api.openai.com`，填写`https://api.openai.com/`

    - 不可正常访问`api.openai.com`，填写其反代地址（可使用[Cloudflare Worker](https://github.com/xqdoo00o/openai-proxy)等反代），注意：反代接口响应需添加跨域Header `Access-Control-Allow-Origin`
- **同时部署HTML和OpenAI反代接口**

    **注意：服务器需正常访问`api.openai.com`，网页不用设置自定义接口了**
    - 使用nginx，示例配置如下

        ```
        server {
            listen       80;
            server_name  example.com;
            #开启openai接口的gzip压缩，大量重复文本的压缩率高，节省服务端流量
            gzip  on;
            gzip_min_length 1k;
            gzip_types text/event-stream;

            #如需部署在网站子路径，如"example.com/chatgpt"，配置如下
            #location ^~ /chatgpt/v1 {
            location ^~ /v1 {
                proxy_pass https://api.openai.com/v1;
                proxy_set_header Host api.openai.com;
                proxy_ssl_name api.openai.com;
                proxy_ssl_server_name on;
                #注意Bearer 后改为正确的token。如需网页设置自定义API key使用，则注释掉下一行
                proxy_set_header  Authorization "Bearer sk-your-token";
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
        }
        ```
        如服务器无法正常访问`api.openai.com`，可配合socat反代和http代理使用，proxy_pass配置改成
        ```
        proxy_pass https://127.0.0.1:8443/v1;
        ```
        并打开socat
        ```
        socat TCP4-LISTEN:8443,reuseaddr,fork PROXY:http代理地址:api.openai.com:443,proxyport=http代理端口
        ```
    - 使用Caddy，可以自动生产HTTPS证书，示例配置如下

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
        **Caddy 2.6.5及之后版本支持https_proxy和http_proxy环境变量，如服务器无法正常访问`api.openai.com`，可先设置代理环境变量**

## 自定义选项

- 可选GPT模型，默认gpt-3.5，当前使用gpt-4模型需通过openai的表单申请。

- 可选自定义接口地址，使用nginx或caddy部署反代后可以不设置。

- 可选API key，默认不设置，**如需网页设置自定义API key使用，反代接口最好配置https，公网以http方式明文传输API key极易被中间人截获。**

- 可选系统角色，默认不开启，有四个预设角色，并动态加载[awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)中的角色。
- 可选角色性格，默认灵活创新，对应接口文档的top_p参数。

- 可选回答质量，默认平衡，对应接口文档的temperature参数。

- 修改打字机速度，默认较快，值越大速度越快。

- 允许连续对话，默认开启，对话中包含上下文信息，会导致api费用增加。

- 允许长回复，默认关闭，**开启后可能导致api费用增加，并丢失大部分上下文，对于一些要发送`继续`才完整的回复，不用发`继续`了。**

- 选择语音，默认Bing语音，支持Azure语音和系统语音，可分开设置提问语音和回答语音。

- 音量，默认最大。

- 语速，默认正常。

- 音调，默认正常。

- 允许连续朗读，默认开启，连续郎读到所有对话结束。

- 允许自动朗读，默认关闭，自动朗读新的回答。**（iOS需打开设置-自动播放视频预览，Mac上Safari需打开此网站的设置-允许全部自动播放）**

- 支持语音输入，默认识别为普通话，可长按语音按钮修改识别选项。**语音识别必需条件：使用chrome内核系浏览器 + https网页或本地网页。** 如点击语音按钮没反应，可能是未授予麦克风权限或者没安装麦克风设备。

- 左边栏支持功能，新建会话，重命名，删除会话。导出所有会话，导入会话文件，清空所有会话。
