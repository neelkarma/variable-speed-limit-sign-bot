FROM node:16
ARG DATABASE_URL
ARG BOT_TOKEN
ARG BOT_CLIENT_ID
ARG DEV_GUILD_IDS
ENV DATABASE_URL=${DATABASE_URL} \
  BOT_TOKEN=${BOT_TOKEN} \
  BOT_CLIENT_ID=${BOT_CLIENT_ID} \
  DEV_GUILD_IDS=${DEV_GUILD_IDS}
COPY . /app
RUN cd /app &&\
  yarn &&\
  npx prisma migrate deploy &&\
  yarn deploy:prod
CMD cd /app && node ./dist/index.js


