#/bin/bash
# 后端代码自动运行
cd /Users/hmr/Desktop/个人项目/upLoadFile && scp ./server.js root@120.55.93.29:/www/wwwroot/image.huangmaorui.cn/ && ssh root@120.55.93.29 'pm2 stop 1 && pm2 start 1'
# 看后台打印值
# cd /Users/hmr/Desktop/毕业设计/travel_hmr && scp ./serve.js root@120.55.93.29:/www/wwwroot/hmr.nbxinyitec.com/
