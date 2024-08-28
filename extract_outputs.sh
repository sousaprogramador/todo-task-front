#!/bin/bash

# Extrair saídas do Terraform
S3_BUCKET=$(terraform output -raw s3_bucket_name)
S3_WEBSITE_URL=$(terraform output -raw s3_website_url)

# Verificar se as saídas foram extraídas com sucesso
if [[ -z "$S3_BUCKET" || -z "$S3_WEBSITE_URL" ]]; then
  echo "Error: No outputs found or outputs are empty."
  exit 1
fi

# Definir variáveis de ambiente para os próximos passos
echo "S3_BUCKET=$S3_BUCKET" >> $GITHUB_ENV
echo "S3_WEBSITE_URL=$S3_WEBSITE_URL" >> $GITHUB_ENV

# Depuração
echo "S3_BUCKET=$S3_BUCKET"
echo "S3_WEBSITE_URL=$S3_WEBSITE_URL"
