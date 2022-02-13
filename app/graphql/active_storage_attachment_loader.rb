# frozen_string_literal: true
class ActiveStorageAttachmentLoader < GraphQL::Batch::Loader
  def self.validate(model, attachment_name)
    new(model, attachment_name)
    nil
  end

  def initialize(model, attachment_name)
    @model = model
    @attachment_name = attachment_name
    @multiple = model.reflect_on_attachment(attachment_name).macro == :has_many_attached
    @association_name = @multiple ? :"#{attachment_name}_attachments" : :"#{attachment_name}_attachment"
    validate
  end

  def load(record)
    raise TypeError, "#{@model} loader can't load association for #{record.class}" unless record.is_a?(@model)
    return Promise.resolve(read_association(record)) if association_loaded?(record)
    super
  end

  # We want to load the associations on all records, even if they have the same id
  def cache_key(record)
    record.object_id
  end

  def perform(records)
    preload_association(records)
    records.each { |record| fulfill(record, read_association(record)) }
  end

  private

  def validate
    return if @model.reflect_on_association(@association_name)
    raise ArgumentError, "No association #{@association_name} on #{@model}"
  end

  def preload_association(records)
    ::ActiveRecord::Associations::Preloader.new(records: records, associations: { @association_name => :blob }).call
  end

  def read_association(record)
    association_value = record.public_send(@attachment_name)
    @multiple ? association_value.attachments : association_value.attachment
  end

  def association_loaded?(record)
    return false unless record.association(@association_name).loaded?

    if @multiple
      record.public_send(@attachment_name).all? { |attachment| attachment.association(:blob)&.loaded? }
    else
      record.public_send(@attachment_name)&.association(:blob)&.loaded?
    end
  end
end
