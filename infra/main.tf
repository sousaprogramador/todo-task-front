provider "aws" {
  region = "sa-east-1"
}

data "aws_s3_bucket" "existing_bucket" {
  bucket = "todo-site-sousa-dev"
  # A configuração abaixo impede erros caso o bucket não exista
  skip_region_validation      = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
}

resource "aws_s3_bucket" "static_site" {
  bucket = "todo-site-sousa-dev"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  # Só cria o bucket se ele não existir
  lifecycle {
    prevent_destroy = true
  }

  provisioner "local-exec" {
    when    = destroy
    command = "echo 'Não posso destruir este bucket!'; exit 1"
  }

  depends_on = [data.aws_s3_bucket.existing_bucket]
}

resource "aws_s3_bucket_policy" "static_site_policy" {
  bucket = aws_s3_bucket.static_site.bucket
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "arn:aws:s3:::${aws_s3_bucket.static_site.bucket}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_versioning" "static_site_versioning" {
  bucket = aws_s3_bucket.static_site.bucket

  versioning_configuration {
    status = "Enabled"
  }
}

output "s3_bucket_name" {
  value = aws_s3_bucket.static_site.bucket
}

output "s3_website_url" {
  value = aws_s3_bucket.static_site.website_endpoint
}
