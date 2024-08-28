provider "aws" {
  region = "sa-east-1"
}

resource "aws_s3_bucket" "static_site" {
  bucket = "todo-site-sousa-dev"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  versioning {
    enabled = true
  }

  lifecycle {
    ignore_changes = [website, versioning]
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

output "s3_bucket_name" {
  value = aws_s3_bucket.static_site.bucket
}

output "s3_website_url" {
  value = aws_s3_bucket.static_site.website_endpoint
}
