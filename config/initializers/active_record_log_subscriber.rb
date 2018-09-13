# from http://www.jkfill.com/2015/02/14/log-which-line-caused-a-query/
module LogQuerySource
  def debug(*args, &block)
    return unless super

    backtrace = Rails.backtrace_cleaner.clean caller

    relevant_caller_line = backtrace.detect do |caller_line|
      !caller_line.include?('/initializers/')
    end

    logger.debug("  ↳ #{relevant_caller_line.sub("#{Rails.root}/", '')}") if relevant_caller_line
  end
end

ActiveRecord::LogSubscriber.send :prepend, LogQuerySource if ENV['LOG_QUERY_SOURCE']
