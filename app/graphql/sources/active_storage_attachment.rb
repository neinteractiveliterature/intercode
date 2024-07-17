class Sources::ActiveStorageAttachment < GraphQL::Dataloader::Source
  def initialize(model, attachment_name)
    @model = model
    @attachment_name = attachment_name
    @multiple = model.reflect_on_attachment(attachment_name).macro == :has_many_attached
    @association_name = @multiple ? :"#{attachment_name}_attachments" : :"#{attachment_name}_attachment"
  end

  def fetch(records)
    ::ActiveRecord::Associations::Preloader.new(records: records, associations: { @association_name => :blob }).call
    records.map { |record| record.public_send(@association_name) }
  end

  def result_key_for(record)
    record.object_id # even if the records are equivalent, handle each distinct Ruby object separately
  end
end
