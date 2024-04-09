---
author: mantic
title: hugo+nginx部署站点
date: 2024-01-31
usePageBundles: true
---

## hugo
wget https://github.com/gohugoio/hugo/releases/download/v0.122.0/hugo_extended_0.122.0_linux-amd64.deb
dpkg -i hugo_extended_0.122.0_linux-amd64.deb
wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
rm -rf /usr/local/go && tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
vi /etc/profile
添加：export PATH=$PATH:/usr/local/go/bin
source /etc/profile

在你的站点目录下，执行`hugo`，
mv public /var/www/public
chown -R www-data:www-data /var/www/public

vi /etc/nginx/sites-enabled/default 

```
server {
	listen 80;
	listen [::]:80;
 	listen 443 ssl;
 	listen [::]:443 ssl;
	server_name tpinellia.com;
	ssl_certificate "/data/tpinellia.com/fullchain.pem";
        ssl_certificate_key "/data/tpinellia.com/privkey.pem";
	return 301 https://www.tpinellia.com$request_uri;
}

server {
	listen 80;
	listen [::]:80;
	server_name www.tpinellia.com;
	return 301 https://www.tpinellia.com$request_uri;
}

server {
 	listen 443 ssl default_server;
 	listen [::]:443 ssl default_server;
	server_name www.tpinellia.com;
	ssl_certificate "/data/tpinellia.com/fullchain.pem";
        ssl_certificate_key "/data/tpinellia.com/privkey.pem";
	ssl_session_cache shared:SSL:10m;
	ssl_session_timeout  10m;
	ssl_ciphers HIGH:!aNULL:!MD5;
	ssl_prefer_server_ciphers on;

	root /var/www/public;
	location / {
		try_files $uri $uri/ =404;
	}
}
```

nginx -t 

systemctl restart nginx.service









## 安装nginx

1. `apt-get install nginx`
2. ``
iptables -I INPUT -p tcp -m tcp --dport 80 -j ACCEPT
iptables -I INPUT -p tcp -m tcp --dport 443 -j ACCEPT
apt-get install socat
acme.sh --register-account -m 1574818824@qq.com
acme.sh --issue -d tpinellia.com --standalone -k ec-256 --force
mkdir -p /data/tpinellia.com
acme.sh --installcert -d tpinellia.com --fullchainpath /data/tpinellia.com/fullchain.crt --keypath /data/tpinellia.com/privkey.key --ecc --force
3. 
4. 如果客户端连接出现：`VMessAEAD is enforced and a non VMessAEAD connection is received.You can still disable this security feature with environment variable v2ray.vmess.aead.forced = false . You will not be able to enable legacy header workaround in the future.`,那么在service里新增`Environment="V2RAY_VMESS_AEAD_FORCED=false"`
```
vi /etc/systemd/system/v2ray.service
[Unit]
Description=V2Ray Service
Documentation=https://www.v2fly.org/
After=network.target nss-lookup.target

[Service]
User=nobody
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
NoNewPrivileges=true
ExecStart=/usr/local/bin/v2ray run -config /usr/local/etc/v2ray/config.json
Restart=on-failure
RestartPreventExitStatus=23
Environment="V2RAY_VMESS_AEAD_FORCED=false"

[Install]
WantedBy=multi-user.target
```


```
server {
	listen 443 ssl default_server;
	server_name tpinellia.com;
	ssl_certificate "/data/tpinellia.com/fullchain.crt";        
        ssl_certificate_key "/data/tpinellia.com/privkey.key"; # 改成你的证书地址

	root /var/www/public;
	location / {
		try_files $uri $uri/ =404;
	}
}

server {
	listen 12376 ssl http2;
	server_name tpinellia.com;
	root /var/www/v2ray;
	index index.html;
	ssl_protocols TLSv1.2 TLSv1.3; # tls 1.3要求nginx 1.13.0及以上版本
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 1d;
        ssl_session_tickets off;
        ssl_certificate "/data/tpinellia.com/fullchain.crt";
        ssl_certificate_key "/data/tpinellia.com/privkey.key"; # 改成你的证书地址

        access_log  /var/log/nginx/xxxx.access.log;
        error_log /var/log/nginx/xxx.error.log;

	location /awesomepath { # 与 V2Ray 配置中的 path 保持一致
  	      proxy_redirect off;
  	      proxy_pass http://127.0.0.1:12345; # 假设v2ray的监听地址是12345
  	      proxy_http_version 1.1;
  	      proxy_set_header Upgrade $http_upgrade;
  	      proxy_set_header Connection "upgrade";
  	      proxy_set_header Host $host;
  	      proxy_set_header X-Real-IP $remote_addr;
  	      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  	}
}

```


server {
	listen 80;
	listen [::]:80;
 	listen 443 ssl;
 	listen [::]:443 ssl;
	server_name tpinellia.com;
	ssl_certificate "/data/tpinellia.com/fullchain.pem";
        ssl_certificate_key "/data/tpinellia.com/privkey.pem";
	return 301 https://www.tpinellia.com$request_uri;
}

server {
	listen 80;
	listen [::]:80;
	server_name www.tpinellia.com;
	return 301 https://www.tpinellia.com$request_uri;
}

server {
 	listen 443 ssl default_server;
 	listen [::]:443 ssl default_server;
	server_name www.tpinellia.com;
	ssl_certificate "/data/tpinellia.com/fullchain.pem";
        ssl_certificate_key "/data/tpinellia.com/privkey.pem";
	ssl_session_cache shared:SSL:10m;
	ssl_session_timeout  10m;
	ssl_ciphers HIGH:!aNULL:!MD5;
	ssl_prefer_server_ciphers on;

	root /var/www/public;
	location / {
		try_files $uri $uri/ =404;
	}

	location /download {
		autoindex on;
		autoindex_exact_size off;
	}
}
