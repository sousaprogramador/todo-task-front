output "s3_bucket_name" {
  value = aws_s3_bucket.static_site.bucket
}

output "s3_website_url" {
  value = aws_s3_bucket.static_site.website_endpoint
}
