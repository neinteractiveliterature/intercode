class FormItem < ApplicationRecord
  DEFAULT_PROPERTIES_CONFIG = JSON.parse(
    File.read(File.expand_path('config/form_item_default_properties.json', Rails.root))
  )

  PROPERTIES_SCHEMA = {
    age_restrictions: {
      identifier: :required,
      caption: :required,
      required: :optional
    },
    date: {
      identifier: :required,
      caption: :required,
      required: :optional
    },
    event_email: {
      identifier: :required,
      required: :optional
    },
    free_text: {
      identifier: :required,
      caption: :required,
      lines: :required,
      free_text_type: :optional,
      required: :optional,
      format: :optional
    },
    multiple_choice: {
      identifier: :required,
      caption: :required,
      style: :required,
      choices: :required,
      required: :optional,
      other: :optional,
      other_caption: :optional
    },
    registration_policy: {
      identifier: :required,
      presets: :required,
      allow_custom: :required,
      required: :optional
    },
    static_text: {
      content: :required,
      style: :required
    },
    timeblock_preference: {
      identifier: :required,
      caption: :required,
      timeblocks: :required,
      omit_timeblocks: :optional,
      hide_timestamps: :optional,
      required: :optional
    },
    timespan: {
      identifier: :required,
      caption: :required,
      required: :optional
    }
  }.deep_stringify_keys

  belongs_to :form_section
  has_one :form, through: :form_section
  acts_as_list scope: :form_section

  serialize :properties, JSON
  serialize :default_value, JSON

  validates :item_type, presence: true
  validates :item_type, inclusion: { in: PROPERTIES_SCHEMA.keys.map(&:to_s) }
  validate :ensure_unique_identifier_across_form
  validates :identifier, uniqueness: {
    allow_nil: true,
    conditions: -> { joins(:form_section) },
    scope: 'form_sections.form_id'
  }
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

      field_value = (respond_to?(field) && public_send(field)) || properties[field]
      errors.add :properties, "does not include #{field}, which is required" if field_value.nil?
    end
  end

  def ensure_no_extra_properties(schema)
    (properties.keys - schema.keys).each do |extra_field|
      errors.add :properties, "includes unknown field #{extra_field}"
    end
  end

  def ensure_unique_identifier_across_form
    return unless identifier.present?

    other_identifiers_scope = FormItem.where(
      form_section_id: FormSection.where(form_id: form.id).select(:id)
    )
    other_identifiers_scope = other_identifiers_scope.where.not(id: id) if persisted?
    other_identifiers = other_identifiers_scope.pluck(:identifier)

    return unless other_identifiers.include?(identifier)
    errors.add :identifier, 'is already taken'
  end
end
