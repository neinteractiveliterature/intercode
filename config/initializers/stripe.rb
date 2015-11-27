Rails.configuration.stripe = {
  :publishable_key => ENV['STRIPE_PUBLISHABLE_KEY'] || 'pk_test_uD3hl7sRFOjcbdSG6KaH9olQ',
  :secret_key      => ENV['STRIPE_SECRET_KEY'] || 'sk_test_VRD1WlpRoaPdwhmzRTIoqRrr'
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]