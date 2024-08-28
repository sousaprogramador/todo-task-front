provider "aws" {
  region = "sa-east-1"
}

# Dados do bucket existente
data "aws_s3_bucket" "existing_bucket" {
  bucket = "todo-site-sousa-dev"
}

# Recurso do bucket S3
resource "aws_s3_bucket" "static_site" {
  count  = data.aws_s3_bucket.existing_bucket.id != "" ? 0 : 1
  bucket = "todo-site-sousa-dev-unique"

  lifecycle {
    prevent_destroy = true
  }
}

# Configuração do website para o bucket S3
resource "aws_s3_bucket_website_configuration" "static_site" {
  count  = data.aws_s3_bucket.existing_bucket.id != "" ? 0 : 1
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
  count  = data.aws_s3_bucket.existing_bucket.id != "" ? 0 : 1
  bucket = aws_s3_bucket.static_site[0].bucket

  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false
  restrict_public_buckets = false
}

# Controles de propriedade para o bucket S3
resource "aws_s3_bucket_ownership_controls" "static_site_ownership" {
  count  = data.aws_s3_bucket.existing_bucket.id != "" ? 0 : 1
  bucket = aws_s3_bucket.static_site[0].bucket

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Política para o bucket S3
resource "aws_s3_bucket_policy" "static_site_policy" {
  count  = data.aws_s3_bucket.existing_bucket.id != "" ? 0 : 1
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
  count  = data.aws_s3_bucket.existing_bucket.id != "" ? 0 : 1
  bucket = aws_s3_bucket.static_site[0].bucket

  versioning_configuration {
    status = "Enabled"
  }
}

# Outputs
output "s3_bucket_name" {
  value = data.aws_s3_bucket.existing_bucket.id != "" ? data.aws_s3_bucket.existing_bucket.bucket : aws_s3_bucket.static_site[0].bucket
}

output "s3_website_url" {
  value = data.aws_s3_bucket.existing_bucket.id != "" ? data.aws_s3_bucket.existing_bucket.website_endpoint : aws_s3_bucket_website_configuration.static_site[0].website_endpoint
}
