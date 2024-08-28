provider "aws" {
  region = "sa-east-1"
}

data "aws_s3_objects" "existing_bucket" {
  bucket = "todo-site-sousa-dev"
}

resource "aws_s3_bucket" "static_site" {
  count  = length(data.aws_s3_objects.existing_bucket.keys) == 0 ? 1 : 0
  bucket = "todo-site-sousa-dev"

  versioning {
    enabled = true
  }

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  object_ownership {
    rule = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_policy" "static_site_policy" {
  count  = length(data.aws_s3_objects.existing_bucket.keys) == 0 ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "arn:aws:s3:::todo-site-sousa-dev/*"
      }
    ]
  })
  depends_on = [aws_s3_bucket.static_site]
}

resource "aws_s3_bucket_public_access_block" "public_access_block" {
  count  = length(data.aws_s3_objects.existing_bucket.keys) == 0 ? 1 : 0
  bucket = aws_s3_bucket.static_site[0].bucket

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

output "s3_bucket_name" {
  value       = length(aws_s3_bucket.static_site) > 0 ? aws_s3_bucket.static_site[0].bucket : "todo-site-sousa-dev"
  description = "O nome do bucket S3"
}

output "s3_website_url" {
  value       = length(aws_s3_bucket.static_site) > 0 ? aws_s3_bucket.static_site[0].website_endpoint : "https://todo-site-sousa-dev.s3-website-${var.aws_region}.amazonaws.com"
  description = "A URL do site no S3"
}
