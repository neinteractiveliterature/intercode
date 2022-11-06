GC.auto_compact = ENV["RUBY_GC_AUTO_COMPACT"].present?

STDERR.puts "Ruby GC auto-compact is #{GC.auto_compact ? "enabled" : "disabled"}."
