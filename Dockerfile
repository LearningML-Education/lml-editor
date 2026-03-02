FROM oven/bun:1.3.6 AS builder

ARG INIT_MESSAGE_SHOW=false
ARG INIT_MESSAGE_TITLE=Atención
ARG INIT_MESSAGE_DESCRIPTION='LearningML necesita tu ayuda'
ARG SHOW_FOOTER_SPONSORS=true
ARG INIT_MESSAGE_TIMEOUT=3000
ARG URL_SCRATCH=https://v2.learningml.org/scratch/?
ARG FORCE_CPU_BACKEND_CHROME=false

WORKDIR /app
COPY . /app
RUN bun install && bun run build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
