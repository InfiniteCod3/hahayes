#!/bin/bash
apt update
apt install unzip git -y
git clone https://github.com/InfiniteCod3/hahayes.git
cd hahayes
curl -fsSL https://fnm.vercel.app/install | bash
source /root/.bashrc
fnm install v19.3.0
npm i colors
npm i request
npx playwright install-deps
chmod +x fixedtls
ulimit -n 999999
npm i
npm i playwright
