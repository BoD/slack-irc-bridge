FROM node:18-slim
LABEL maintainer="BoD <BoD@JRAF.org>"
WORKDIR /app
COPY src src/
COPY *.json .
RUN npm install
ENTRYPOINT ["npm", "start"]
