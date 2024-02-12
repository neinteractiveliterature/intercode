class Sources::ActiveRecordAssociation < GraphQL::Dataloader::Source
  def initialize(model, association_name)
    @model = model
    @association_name = association_name
  end

  def fetch(records)
    ::ActiveRecord::Associations::Preloader.new(records: records, associations: @association_name).call
    records.map { |record| record.public_send(@association_name) }
  end

  def result_key_for(record)
    record.object_id # even if the records are equivalent, handle each distinct Ruby object separately
  end
end
