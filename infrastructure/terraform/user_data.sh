#!/bin/bash
set -e

# Install Docker
yum update -y
yum install -y docker git
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Install Docker Compose v2
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Install AWS CLI v2
yum install -y aws-cli

# Create app directory
mkdir -p /opt/mytaskhelper
chown ec2-user:ec2-user /opt/mytaskhelper

# ECR login at boot (via IAM role — no credentials needed)
aws ecr get-login-password --region ${aws_region} | \
  docker login --username AWS --password-stdin ${ecr_registry}

echo "Bootstrap complete. Deploy via GitHub Actions."
