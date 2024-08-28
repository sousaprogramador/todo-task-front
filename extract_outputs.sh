#!/bin/bash

# Extrair saídas do Terraform
S3_BUCKET=$(terraform output -raw s3_bucket_name)
S3_WEBSITE_URL=$(terraform output -raw s3_website_url)

# Verificar se as variáveis estão vazias
if [[ -z "$S3_BUCKET" || -z "$S3_WEBSITE_URL" ]]; then
  echo "Erro ao extrair saídas do Terraform"
  exit 1
fi

# Configurar variáveis de ambiente no GitHub Actions
echo "S3_BUCKET=$S3_BUCKET" >> $GITHUB_ENV
echo "S3_WEBSITE_URL=$S3_WEBSITE_URL" >> $GITHUB_ENV

# Confirmar saída limpa
echo "S3_BUCKET=$S3_BUCKET"
echo "S3_WEBSITE_URL=$S3_WEBSITE_URL"

