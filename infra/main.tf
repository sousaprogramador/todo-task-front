provider "aws" {
  region = "sa-east-1"
}

data "aws_s3_bucket" "existing_bucket" {
  bucket = "todo-site-sousa-dev"
}

resource "aws_s3_bucket" "static_site" {
  count  = data.aws_s3_bucket.existing_bucket.id == "" ? 1 : 0
  bucket = "todo-site-sousa-dev"
  acl    = "public-read"

  versioning {
    enabled = true
  }

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "aws_s3_bucket_policy" "static_site_policy" {
  count  = data.aws_s3_bucket.existing_bucket.id == "" ? 1 : 0
  bucket = aws_s3_bucket.static_site[count.index].bucket
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
  count  = data.aws_s3_bucket.existing_bucket.id == "" ? 1 : 0
  bucket = aws_s3_bucket.static_site[count.index].bucket

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

output "s3_bucket_name" {
  value       = length(aws_s3_bucket.static_site) > 0 ? aws_s3_bucket.static_site[0].bucket : data.aws_s3_bucket.existing_bucket.bucket
  description = "O nome do bucket S3"
}

output "s3_website_url" {
  value       = length(aws_s3_bucket.static_site) > 0 ? aws_s3_bucket.static_site[0].website_endpoint : "O bucket já existe, URL não gerada."
  description = "A URL do site no S3"
}
