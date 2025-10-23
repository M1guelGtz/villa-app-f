#!/usr/bin/env bash
# Simple helper to build and optionally push the Docker image.
# Usage:
#   ./scripts/deploy-image.sh myusername/villa-app:latest --push

set -euo pipefail
IMAGE_NAME=${1:-villa-app:latest}
PUSH=false
if [ "${2:-}" = "--push" ]; then
  PUSH=true
fi

echo "Building image ${IMAGE_NAME}..."
docker build -t ${IMAGE_NAME} .

echo "Built ${IMAGE_NAME}"

if [ "$PUSH" = true ]; then
  echo "Pushing ${IMAGE_NAME} to registry..."
  docker push ${IMAGE_NAME}
  echo "Push completed"
fi

# Example run on EC2 after pulling image:
# docker run -d -p 80:80 --name villa-app -e API_URL=http://backend-host:3000 myusername/villa-app:latest

# The container runs a small Node server that serves the built SPA from /dist.
