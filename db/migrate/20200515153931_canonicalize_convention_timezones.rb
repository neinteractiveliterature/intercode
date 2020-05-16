class CanonicalizeConventionTimezones < ActiveRecord::Migration[6.0]
  def change
    up_only do
      Convention.find_each do |convention|
        tzinfo = convention.timezone.tzinfo
        next if tzinfo.identifier == tzinfo.canonical_identifier

        say "Updating timezone for #{convention.name} from #{tzinfo.identifier} to #{tzinfo.canonical_identifier}"
        convention.update!(timezone_name: tzinfo.canonical_identifier)
      end
    end
  end
end
