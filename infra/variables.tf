variable "aws_region" {
  description = "Região AWS onde o bucket será criado"
  type        = string
  default     = "us-east-1"
}

variable "s3_bucket_name" {
  description = "Nome do bucket S3"
  type        = string
}
