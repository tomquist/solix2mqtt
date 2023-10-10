FROM node:18-alpine as build

RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm ci \
    && npm run build \
    && npm prune --production \
    && mkdir out \
    && mv bin out/ \
    && mv node_modules out/

FROM alpine
RUN apk add --update nodejs
RUN mkdir /app
WORKDIR /app
COPY --from=build /app/out /app

CMD [ "node", "/app/bin/app.js" ]