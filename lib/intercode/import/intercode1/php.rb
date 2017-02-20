module Intercode::Import::Intercode1::Php
  def self.exec_php(php, filename = 'program.php')
    temp_program = Tempfile.new(filename)
    begin
      temp_program.write php
      temp_program.flush

      output, _ = Open3.capture2e('php', temp_program.path)
      output
    ensure
      temp_program.close
      temp_program.unlink
    end
  end
end