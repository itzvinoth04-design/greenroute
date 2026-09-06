# Docker Configuration & Orchestration Guide

This folder contains supporting container configurations for GreenRoute.

### Files Overview
- `nginx.conf`: Nginx reverse proxy routing `/` to the React single page application and `/api/` upstream to the Node.js backend.
- `../docker-compose.yml`: Multi-container orchestration specifying volume persistence for the SQLite database and internal bridge networking.

### Quick Commands
```bash
# Build and launch in background
docker-compose up --build -d

# View real-time container logs
docker-compose logs -f

# Stop and remove containers
docker-compose down
```
