#!/bin/bash

# check docker is installed

if ! [ -x "$(command -v docker)" ]; then
    echo 'Error: docker is not installed.' >&2
    exit 1
fi


# check docker is running

if ! docker info >/dev/null 2>&1; then
    echo 'Error: docker is not running.' >&2
    exit 1
fi

# check docker-compose is running

if ! docker compose version >/dev/null 2>&1; then
    echo 'Error: docker-compose is not running.' >&2
    exit 1
fi

# check is node js is installed

if ! [ -x "$(command -v node)" ]; then
    echo 'Error: node js is not installed.' >&2
    exit 1
fi

# check is npm is installed

if ! [ -x "$(command -v npm)" ]; then
    echo 'Error: npm is not installed.' >&2
    exit 1
fi

# install nodemone  http-server

npm install -g nodemon http-server

# check .env is exist

if [ ! -f .env ]; then
    echo 'Error: .env file is not exist.' >&2
    exit 1
fi

# start docker compose
docker compose up -d

# start front end server

http-server ./frontend/generate_qrcode -p 8001 >/dev/null 2>&1 &
http-server ./frontend/ade_company_web -p 8002 >/dev/null 2>&1 &

echo "Frontend server started on http://localhost:8001 and http://localhost:8002"


# start node js server
npm run seed:clean
npm run seed:start
npm run start:dev
