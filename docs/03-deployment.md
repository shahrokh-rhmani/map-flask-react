# Hello World App Deployment Guide

# 1. Server Connection & System Update

```
ssh root@your-server-ip
apt update && apt upgrade -y
```

# 2. Install Prerequisites

```
# Python and pip
apt install python3 python3-pip python3-venv -y

# Node.js 
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs 

# Nginx and tools
apt install nginx git build-essential -y
```

# 3. Clone Project

```
https://github.com/shahrokh-rhmani/map-flask-react.git
cd map-flask-react
```

# 4. Backend Setup (Flask)

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create systemd service file:

```
sudo nano /etc/systemd/system/flaskapp.service
```

Paste this configuration:

```
[Unit]
Description=Gunicorn Flask App
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/root/map-flask-react/backend
Environment="PATH=/root/map-flask-react/backend/venv/bin"
ExecStart=/root/map-flask-react/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:flaskapp.sock \
          --timeout 120 \
          app:app

[Install]
WantedBy=multi-user.target
```

Start and enable service:

```
sudo systemctl start flaskapp
sudo systemctl enable flaskapp
sudo systemctl status flaskapp
sudo systemctl restart flaskapp
```

# 5. Frontend Setup (React)

```
cd ../frontend
npm install
npm run build

sudo mkdir -p /var/www/map-flask-react
sudo cp -r build/* /var/www/map-flask-react/
```

# 6. Nginx Configuration

```
sudo nano /etc/nginx/sites-available/map-flask-react
```

Paste this configuration:

```
server {
    listen 80;
    server_name your-ip-or-domain;

    root /var/www/map-flask-react;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        include proxy_params;
        proxy_pass http://unix:/root/map-flask-react/backend/flaskapp.sock;
    }
}
```

Enable configuration:

```
sudo ln -s /etc/nginx/sites-available/map-flask-react /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

# 7. Permissions Setup

```
sudo chown -R www-data:www-data /root/map-flask-react/backend
sudo chmod 660 /root/map-flask-react/backend/flaskapp.sock
sudo chmod 755 /root /root/map-flask-react /root/map-flask-react/backend
```

# 8. Verification Steps

Check Gunicorn installation:

```
source /root/map-flask-react/backend/venv/bin/activate
pip list | grep gunicorn
```

Test Unix socket:

```
curl --unix-socket /root/map-flask-react/backend/flaskapp.sock http://localhost/api/hello
```

Expected output: 

```
{"message":"Hello from Flask!"}
```
















