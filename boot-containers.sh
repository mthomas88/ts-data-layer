#!/bin/bash

# Start PostgreSQL container
podman run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  postgres:latest

# Start MySQL container
podman run -d \
  --name mysql \
  -e MYSQL_ROOT_PASSWORD=mysecretpassword \
  -p 3306:3306 \
  mysql:latest

# Start MSSQL container
podman run -d \
  --name mssql \
  -e ACCEPT_EULA=Y \
  -e SA_PASSWORD=my!password-1234 \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:latest

# Wait for containers to start up
echo "Waiting for containers to start..."
sleep 10

# Display running containers
echo "Running containers:"
podman ps
