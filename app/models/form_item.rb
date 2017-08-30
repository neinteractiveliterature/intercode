class FormItem < ApplicationRecord
  PROPERTIES_SCHEMA = {
    free_text: {
      identifier: :required,
      caption: :required,
      lines: :required,
      free_text_type: :optional,
      required: :optional,
      format: :optional,
    },
    multiple_choice: {
      identifier: :required,
      caption: :required,
      style: :required,
      choices: :required,
      required: :optional,
    },
    registration_policy: {
      identifier: :required,
      required: :optional,
    },
    static_text: {
      content: :required,
      style: :required,
    },
    timeblock_preference: {
      identifier: :required,
      caption: :required,
      timeblocks: :required,
      omit_timeblocks: :optional,
      required: :optional,
    },
    timespan: {
      identifier: :required,
      caption: :required,
      required: :optional,
    }
  }.deep_stringify_keys

  belongs_to :form_section
  has_one :form, through: :form_section
  acts_as_list scope: :form_section

  serialize :properties, JSON

  validates_presence_of :item_type
  validates_inclusion_of :item_type, in: PROPERTIES_SCHEMA.keys.map(&:to_s)
  validates_uniqueness_of :identifier, allow_nil: true,
    conditions: -> { joins(:form_section) }, scope: 'form_sections.form_id'
  validate :ensure_properties_match_schema

  private

  def ensure_properties_match_schema
    return unless item_type

    schema = PROPERTIES_SCHEMA[item_type]
    return unless schema

    ensure_no_missing_required_properties(schema)
    ensure_no_extra_properties(schema)
  end

  def ensure_no_missing_required_properties(schema)
    schema.each do |field, required|
      next unless required == :required

      unless (respond_to?(field) && public_send(field)) || properties[field]
        errors.add :properties, "does not include #{field}, which is required"
      end
    end
  end

  def ensure_no_extra_properties(schema)
    (properties.keys - schema.keys).each do |extra_field|
      errors.add :properties, "includes unknown field #{extra_field}"
    end
  end
end
