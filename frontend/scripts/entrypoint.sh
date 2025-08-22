#!/bin/sh

GREEN='\033[0;32m'
NO_COLOR='\033[0m'

set -e 
npm i

if [[ $REACT_APP_ENV == "development" ]]; then
	echo -e "${GREEN}Script - Starting in development mode ...${NO_COLOR}\n"
	npm start
else
	echo -e "${GREEN}Script - Building application ...${NO_COLOR}\n"
	npm run build
	#npm install -g serve
	#serve -s build -l 8080
fi
