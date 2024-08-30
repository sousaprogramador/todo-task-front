provider "aws" {
  region = "sa-east-1"
}

# Dados do bucket existente
data "aws_s3_bucket" "existing_bucket" {
  bucket = "todo-site-sousa-dev"
}

# Condição para verificar a existência do bucket
locals {
  create_bucket = data.aws_s3_bucket.existing_bucket.id == "" ? true : false
}

# Recurso do bucket S3
resource "aws_s3_bucket" "static_site" {
  count  = local.create_bucket ? 1 : 0
  bucket = "todo-site-sousa-dev-unique"

  lifecycle {
    prevent_destroy = true
  }
}

# Configuração do website para o bucket S3
resource "aws_s3_bucket_website_configuration" "static_site" {
  count  = local.create_bucket ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# Bloqueio de acesso público para o bucket S3
resource "aws_s3_bucket_public_access_block" "static_site_public_access" {
  count  = local.create_bucket ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket

  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false
  restrict_public_buckets = false
}

# Controles de propriedade para o bucket S3
resource "aws_s3_bucket_ownership_controls" "static_site_ownership" {
  count  = local.create_bucket ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Política para o bucket S3
resource "aws_s3_bucket_policy" "static_site_policy" {
  count  = local.create_bucket ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "arn:aws:s3:::${aws_s3_bucket.static_site[0].bucket}/*"
      }
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.static_site_public_access]
}

# Versionamento para o bucket S3
resource "aws_s3_bucket_versioning" "static_site_versioning" {
  count  = local.create_bucket ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket

  versioning_configuration {
    status = "Enabled"
  }
}

# Outputs
output "s3_bucket_name" {
  value = local.create_bucket ? aws_s3_bucket.static_site[0].bucket : data.aws_s3_bucket.existing_bucket.bucket
}

output "s3_website_url" {
  value = local.create_bucket ? aws_s3_bucket_website_configuration.static_site[0].website_endpoint : data.aws_s3_bucket.existing_bucket.website_endpoint
}
