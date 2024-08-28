provider "aws" {
  region = "sa-east-1"
}

data "aws_s3_bucket" "existing_bucket" {
  bucket = "todo-site-sousa-dev"
}

resource "aws_s3_bucket" "static_site" {
  count  = data.aws_s3_bucket.existing_bucket.bucket == "" ? 1 : 0
  bucket = "todo-site-sousa-dev"
}

resource "aws_s3_bucket_website_configuration" "static_site_website" {
  count  = length(aws_s3_bucket.static_site) > 0 ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_policy" "static_site_policy" {
  count  = length(aws_s3_bucket.static_site) > 0 ? 1 : 0
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
  depends_on = [aws_s3_bucket.static_site]
}

output "s3_bucket_name" {
  value       = coalesce(data.aws_s3_bucket.existing_bucket.bucket, aws_s3_bucket.static_site[0].bucket)
  description = "O nome do bucket S3"
}

output "s3_website_url" {
  value       = coalesce(data.aws_s3_bucket.existing_bucket.website_endpoint, aws_s3_bucket_website_configuration.static_site_website.website_endpoint)
  description = "A URL do site no S3"
}
