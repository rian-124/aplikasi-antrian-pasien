# Gunakan Node versi terbaru (aman untuk NestJS & Prisma)
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json & lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy seluruh source code
COPY . .

# Build NestJS -> hasilnya masuk ke /app/dist
RUN npm run build

# Expose port NestJS
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "start:dev"]
