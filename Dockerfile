FROM  node

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --legacy-peer-deps true

COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev"]