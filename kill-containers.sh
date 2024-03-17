#!/bin/bash

# Stop and remove PostgreSQL container
echo "Stopping and removing PostgreSQL container..."
podman stop postgres
podman rm postgres

# Stop and remove MySQL container
echo "Stopping and removing MySQL container..."
podman stop mysql
podman rm mysql

# Stop and remove MSSQL container
echo "Stopping and removing MSSQL container..."
podman stop mssql
podman rm mssql

echo "All containers stopped and removed."