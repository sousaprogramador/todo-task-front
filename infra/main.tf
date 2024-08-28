provider "aws" {
  region = "sa-east-1"
}

data "aws_s3_bucket" "existing_bucket" {
  bucket = "todo-site-sousa-dev"
}

resource "aws_s3_bucket" "static_site" {
  count  = data.aws_s3_bucket.existing_bucket.bucket != "" ? 0 : 1
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
}

resource "aws_s3_bucket_versioning" "static_site_versioning" {
  count  = length(aws_s3_bucket.static_site) > 0 ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket
  versioning_configuration {
    status = "Enabled"
  }
  depends_on = [aws_s3_bucket.static_site]
}

locals {
  bucket_name = data.aws_s3_bucket.existing_bucket.bucket != "" ? data.aws_s3_bucket.existing_bucket.bucket : (length(aws_s3_bucket.static_site) > 0 ? aws_s3_bucket.static_site[0].bucket : "")
  website_url = data.aws_s3_bucket.existing_bucket.bucket != "" ? data.aws_s3_bucket.existing_bucket.website_endpoint : (length(aws_s3_bucket_website_configuration) > 0 ? aws_s3_bucket_website_configuration.static_site_website[0].website_endpoint : "")
}

output "s3_bucket_name" {
  value = local.bucket_name
}

output "s3_website_url" {
  value = local.website_url
}
