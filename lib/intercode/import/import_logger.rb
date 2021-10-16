require 'term/ansicolor'

module Intercode
  module Import
    class ImportLogger < Logger
      include Singleton

      SEVERITY_COLORS = {
        'FATAL' => %i[black on_red],
        'ERROR' => %i[bold red],
        'WARN' => %i[bold yellow],
        'INFO' => %i[bold green],
        'DEBUG' => %i[dark blue]
      }

      def initialize
        super(STDERR)

        col = Term::ANSIColor
        self.formatter =
          proc do |severity, time, _progname, msg|
            severity_padded = format('%-7s', "[#{severity}]")
            severity_rep = format_severity_rep(severity, severity_padded)

            "#{severity_rep} #{col.dark(col.yellow(time.strftime('%H:%M:%S.%L')))} - #{msg}\n"
          end
      end

      def format_severity_rep(severity, text)
        severity_color = SEVERITY_COLORS[severity]
        return text unless severity_color

        severity_color.reverse.inject(text) { |rep, color_method| Term::ANSIColor.public_send(color_method, rep) }
      end
    end
  end
end
