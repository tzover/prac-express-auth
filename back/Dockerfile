FROM node:14.15.4-slim
ENV CI true
COPY ./app /home/app
COPY ./app/.vscode /root/.vscode-server/data/Machine
WORKDIR /home/app
RUN npm install