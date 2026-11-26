output "cache_policy_ids" {
  description = "IDs of the cache policies, in the shape cloudfront_intercode's shared_policies variable takes."
  value = {
    no_cache     = aws_cloudfront_cache_policy.no_cache.id
    og_shell     = aws_cloudfront_cache_policy.og_shell.id
    static_shell = aws_cloudfront_cache_policy.static_shell.id
  }
}

output "origin_request_policy_ids" {
  description = "IDs of the origin request policies, in the shape cloudfront_intercode's shared_policies variable takes."
  value = {
    forward_all = aws_cloudfront_origin_request_policy.forward_all.id
    og_shell    = aws_cloudfront_origin_request_policy.og_shell.id
  }
}
