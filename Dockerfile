# =======================================================
# Production-ready Dockerfile for SkillSwapify (Nginx)
# =======================================================
FROM nginx:1.27-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default static files
RUN rm -rf ./*

# Copy custom Nginx server block configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static frontend assets
COPY index.html signup.html style.css script.js healthz 50x.html ./

# Expose HTTP port 80 (standard / local / k8s) and 10000 (Render default)
EXPOSE 80 10000

# Built-in container health check using alpine wget
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/healthz || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
