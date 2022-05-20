FROM --platform=linux/amd64 node:16.14.2-alpine

RUN apk update && apk upgrade --update-cache && apk add bash vim git curl make

WORKDIR /app

COPY ["package.json", "yarn.lock*", "/app/"]
RUN yarn --frozen-lockfile --network-timeout 100000

COPY . /app

ENV NODE_OPTIONS="--max_old_space_size=4096 --enable-source-maps"

RUN yarn build

EXPOSE 4000

CMD ["bash", "-c", "make db-migrate && npm start"]
