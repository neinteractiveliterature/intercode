class ConvertConventionLocationsToGeoJSON < ActiveRecord::Migration[7.2]
  def up
    Convention
      .where.not(location: nil)
      .find_each do |convention|
        location = convention.location
        location["properties"] ||= {}
        location["properties"]["name"] = location.delete("text") if location["text"]
        location["properties"]["place_name"] = location.delete("place_name") if location["place_name"]
        convention.save!
      end
  end

  def down
  end
end
