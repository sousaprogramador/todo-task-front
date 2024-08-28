provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "static_site" {
  bucket = var.s3_bucket_name

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket_policy" "static_site_policy" {
  bucket = aws_s3_bucket.static_site.bucket

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${aws_s3_bucket.static_site.bucket}/*"
    }
  ]
}
POLICY
}

output "s3_bucket_name" {
  value = aws_s3_bucket.static_site.bucket
}

output "s3_website_url" {
  value = aws_s3_bucket.static_site.website_endpoint
}
