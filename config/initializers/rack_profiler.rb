# frozen_string_literal: true

if Rails.env.development? && ENV['RACK_MINI_PROFILER']
  require 'rack-mini-profiler'

  # initialization is skipped so trigger it
  Rack::MiniProfilerRails.initialize!(Rails.application)
end
