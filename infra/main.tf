provider "aws" {
  region = "sa-east-1"
}

data "aws_s3_bucket" "existing_bucket" {
  bucket = "todo-site-sousa-dev"
}

resource "aws_s3_bucket" "static_site" {
  bucket = "todo-site-sousa-dev"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  lifecycle {
    prevent_destroy = true
  }

  depends_on = [data.aws_s3_bucket.existing_bucket]
}

resource "aws_s3_bucket_ownership_controls" "static_site_ownership" {
  bucket = aws_s3_bucket.static_site.bucket

  rule {
    object_ownership = "BucketOwnerEnforced"
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
  depends_on = [aws_s3_bucket_ownership_controls.static_site_ownership]
}

resource "aws_s3_bucket_versioning" "static_site_versioning" {
  bucket = aws_s3_bucket.static_site.bucket

  versioning_configuration {
    status = "Enabled"
  }
}

locals {
  bucket_name = data.aws_s3_bucket.existing_bucket.bucket != "" ? data.aws_s3_bucket.existing_bucket.bucket : aws_s3_bucket.static_site.bucket
  website_url = data.aws_s3_bucket.existing_bucket.bucket != "" ? data.aws_s3_bucket.existing_bucket.website_endpoint : aws_s3_bucket.static_site.website_endpoint
}

output "s3_bucket_name" {
  value = local.bucket_name != "" ? local.bucket_name : "Bucket não criado"
}

output "s3_website_url" {
  value = local.website_url != "" ? local.website_url : "Website não configurado"
}
