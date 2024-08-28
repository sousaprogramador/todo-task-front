provider "aws" {
  region = "sa-east-1"
}

data "aws_s3_bucket" "existing_bucket" {
  bucket = "todo-site-sousa-dev"
}

resource "aws_s3_bucket" "static_site" {
  count  = data.aws_s3_bucket.existing_bucket.id == "" ? 1 : 0
  bucket = "todo-site-sousa-dev-unique"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_website_configuration" "static_site" {
  count  = data.aws_s3_bucket.existing_bucket.id == "" ? 1 : 0
  bucket = aws_s3_bucket.static_site.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "static_site_public_access" {
  count  = data.aws_s3_bucket.existing_bucket.id == "" ? 1 : 0
  bucket = aws_s3_bucket.static_site.bucket

  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "static_site_ownership" {
  count  = data.aws_s3_bucket.existing_bucket.id == "" ? 1 : 0
  bucket = aws_s3_bucket.static_site.bucket

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_policy" "static_site_policy" {
  count  = data.aws_s3_bucket.existing_bucket.id == "" ? 1 : 0
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
  depends_on = [aws_s3_bucket_public_access_block.static_site_public_access]
}

resource "aws_s3_bucket_versioning" "static_site_versioning" {
  count  = data.aws_s3_bucket.existing_bucket.id == "" ? 1 : 0
  bucket = aws_s3_bucket.static_site.bucket

  versioning_configuration {
    status = "Enabled"
  }
}

output "s3_bucket_name" {
  value = data.aws_s3_bucket.existing_bucket.bucket != "" ? data.aws_s3_bucket.existing_bucket.bucket : aws_s3_bucket.static_site.bucket
}

output "s3_website_url" {
  value = data.aws_s3_bucket.existing_bucket.website_endpoint != "" ? data.aws_s3_bucket.existing_bucket.website_endpoint : aws_s3_bucket_website_configuration.static_site.website_endpoint
}
