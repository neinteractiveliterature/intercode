desc 'Clean authentication/authorization tables'
task :cleanup do
  %w[doorkeeper:db:cleanup db:sessions:trim].each do |task|
    puts "Running #{task}"
    Rake::Task[task].invoke
  end
end
