output "s3_bucket_name" {
  description = "Nome do bucket S3"
  value       = aws_s3_bucket.static_site.bucket
}

output "s3_website_url" {
  description = "URL do site estático no S3"
  value       = aws_s3_bucket.static_site.website_endpoint
}
