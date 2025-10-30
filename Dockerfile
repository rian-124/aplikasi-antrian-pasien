# stage 1 build

# Base image
FROM node:22-alpine AS build

RUN apk add --no-cache openssl

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm config set registry https://registry.npmmirror.com && npm ci --include=dev

# Bundle app source
COPY --chown=node:node . .

# Generate Prisma Client
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build

# set environment to production
ENV NODE_ENV=production

# set user to node
USER node


# stage 2 production

# Production image
FROM node:22-alpine AS production

RUN apk add --no-cache openssl

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/.env ./.env


RUN chown -R node:node /usr/src/app
# set user to node
USER node

# Start the server using the production build
CMD ["node", "--max-old-space-size=4096", "dist/src/main.js"]



