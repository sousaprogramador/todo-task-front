variable "bucket_name" {
  description = "Nome do bucket S3"
  default     = "todo-site-sousa-dev"
}

variable "create_new_bucket" {
  description = "Indica se deve criar um novo bucket"
  type        = bool
  default     = true
}

variable "region" {
  description = "Região AWS onde o bucket será criado"
  default     = "sa-east-1"
}

provider "aws" {
  region = var.region
}

resource "aws_s3_bucket" "static_site" {
  count  = var.create_new_bucket ? 1 : 0
  bucket = var.bucket_name

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_website_configuration" "static_site" {
  count  = var.create_new_bucket ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "static_site_public_access" {
  count  = var.create_new_bucket ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket

  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "static_site_ownership" {
  count  = var.create_new_bucket ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_policy" "static_site_policy" {
  count  = var.create_new_bucket ? 1 : 0
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

resource "aws_s3_bucket_versioning" "static_site_versioning" {
  count  = var.create_new_bucket ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket

  versioning_configuration {
    status = "Enabled"
  }
}

output "s3_bucket_name" {
  value = var.create_new_bucket ? aws_s3_bucket.static_site[0].bucket : var.bucket_name
}

output "s3_website_url" {
  value = var.create_new_bucket ? aws_s3_bucket_website_configuration.static_site[0].website_endpoint : "https://${var.bucket_name}.s3-website-${var.region}.amazonaws.com"
}
