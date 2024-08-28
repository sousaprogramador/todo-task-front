provider "aws" {
  region = "sa-east-1"
}

resource "aws_s3_bucket" "static_site" {
  bucket = "todo-site-sousa-dev"

  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket_website_configuration" "static_site_website" {
  bucket = aws_s3_bucket.static_site.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
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

resource "aws_s3_bucket_public_access_block" "public_access_block" {
  bucket = aws_s3_bucket.static_site.bucket

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.static_site.bucket
  description = "O nome do bucket S3"
}

output "s3_website_url" {
  value       = aws_s3_bucket_website_configuration.static_site_website.website_endpoint
  description = "A URL do site no S3"
}
