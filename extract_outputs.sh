#!/bin/bash

# Extrair saídas do Terraform e salvar em arquivos temporários
terraform output -raw s3_bucket_name > s3_bucket_name.txt
terraform output -raw s3_website_url > s3_website_url.txt

# Capturar e limpar as saídas
S3_BUCKET=$(head -n 1 s3_bucket_name.txt | tr -d '\r' | tr -d '\n')
S3_WEBSITE_URL=$(head -n 1 s3_website_url.txt | tr -d '\r' | tr -d '\n')

# Verificar se as variáveis estão vazias
if [[ -z "$S3_BUCKET" || -z "$S3_WEBSITE_URL" ]]; then
  echo "Erro ao extrair saídas do Terraform"
  exit 1
fi

# Configurar variáveis de ambiente no GitHub Actions
echo "S3_BUCKET=$S3_BUCKET" >> $GITHUB_ENV
echo "S3_WEBSITE_URL=$S3_WEBSITE_URL" >> $GITHUB_ENV

# Limpar arquivos temporários
rm s3_bucket_name.txt s3_website_url.txt

# Confirmar saída limpa
echo "S3_BUCKET=$S3_BUCKET"
echo "S3_WEBSITE_URL=$S3_WEBSITE_URL"
