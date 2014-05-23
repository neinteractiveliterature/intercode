# Be sure to restart your server when you modify this file.

# Your secret key for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!
# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
Intercode::Application.config.secret_key_base = ENV['SECRET_TOKEN'] || '90fae5fde97108d9cf691ec45b0d166622b97386435cf7b590f998d64fa11e29d0271991154eb7ed76499b59109365dec1561f63483e4a612c1a91ff331e8e30'
