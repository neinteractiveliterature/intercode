desc 'Clean authentication/authorization tables'
task cleanup: :environment do
  CleanupDbService.new.call!
end
