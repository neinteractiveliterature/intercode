if defined?(Rack::MiniProfiler)
  Rack::MiniProfiler.config.start_hidden = true
  Rack::MiniProfiler.config.collapse_results = false
  Rack::MiniProfiler.config.position = 'bottom-left'
end
