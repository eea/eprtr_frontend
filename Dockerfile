# Based on https://github.com/plone/volto/blob/master/entrypoint.sh
FROM node:12-stretch-slim as build

ENV NODE_OPTIONS=--max_old_space_size=$MAX_OLD_SPACE_SIZE

RUN apt-get update -y \
 && apt-get install -y git bsdmainutils vim-nox mc \
 && rm -rf /var/lib/apt/lists/*

RUN npm i -g mrs-developer

WORKDIR /opt/frontend/

COPY docker-image.txt /
COPY . .
# RUN chmod +x optimize_node_modules.sh

RUN mkdir -p /opt/frontend/src/develop

RUN chown -R node /opt/frontend

USER node

RUN echo "prefix = \"/home/node\"\n" > /home/node/.npmrc
RUN rm -rf node_modules .git package-lock.json

RUN npm install mr-developer

#RUN node_modules/.bin/mrdeveloper --config=jsconfig.json --no-config --output=addons
RUN missdev --config=jsconfig.json --output=develop

RUN make activate-all

# RUN NPM_CONFIG_REGISTRY=$NPM_CONFIG_REGISTRY npm ci
# RUN NPM_CONFIG_REGISTRY=$NPM_CONFIG_REGISTRY npm install

# RUN ./optimize_node_modules.sh
# RUN make clean-addons
# RUN rm -f package-lock.json

# RUN RAZZLE_API_PATH=VOLTO_API_PATH RAZZLE_INTERNAL_API_PATH=VOLTO_INTERNAL_API_PATH yarn build

# Second stage build
# FROM node:12-stretch-slim

# COPY . /opt/frontend/
# RUN chown -R node /opt/frontend/

# WORKDIR /opt/frontend/
# USER node

RUN RAZZLE_API_PATH=VOLTO_API_PATH RAZZLE_INTERNAL_API_PATH=VOLTO_INTERNAL_API_PATH yarn \
 && RAZZLE_API_PATH=VOLTO_API_PATH RAZZLE_INTERNAL_API_PATH=VOLTO_INTERNAL_API_PATH yarn build \
 && rm -rf /home/node/.cache

EXPOSE 3000 3001 4000 4001

ENTRYPOINT ["/opt/frontend/entrypoint-prod.sh"]
CMD ["yarn", "start:prod"]
