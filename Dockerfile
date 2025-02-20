FROM node:20.11.0 AS builder

ARG INIT_MESSAGE_SHOW=false
ARG INIT_MESSAGE_TITLE=Atención
ARG INIT_MESSAGE_DESCRIPTION='LearningML necesita tu ayuda'
ARG SHOW_FOOTER_SPONSORS=true
ARG INIT_MESSAGE_TIMEOUT=3000
ARG URL_SCRATCH=https://v2.learningml.org/scratch/?

WORKDIR /app
COPY . /app
RUN npm install -g vite && npm install && vite build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
