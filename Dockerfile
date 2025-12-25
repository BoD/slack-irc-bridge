FROM node:18-slim
LABEL maintainer="BoD <BoD@JRAF.org>"
WORKDIR /app
COPY src src/
COPY patches patches/
COPY *.json .
RUN npm install
RUN npx patch-package
ENTRYPOINT ["npm", "start"]
