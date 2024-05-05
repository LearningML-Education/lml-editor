FROM node:20.11.0
WORKDIR /app
COPY . /app
RUN npm install -g vite
RUN npm install
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
