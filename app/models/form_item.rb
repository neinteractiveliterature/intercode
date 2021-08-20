# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: form_items
#
#  id                 :bigint           not null, primary key
#  admin_description  :text
#  default_value      :jsonb
#  identifier         :text
#  item_type          :text
#  position           :integer
#  properties         :jsonb
#  public_description :text
#  visibility         :string           default("normal"), not null
#  writeability       :string           default("normal"), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  form_section_id    :bigint
#
# Indexes
#
#  index_form_items_on_form_section_id  (form_section_id)
#
# Foreign Keys
#
#  fk_rails_...  (form_section_id => form_sections.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
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
      format: :optional,
      advisory_word_limit: :optional,
      advisory_character_limit: :optional
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

  # In order from lowest to highest rank.  Higher roles always include lower roles
  # Must be updated in sync with FORM_ITEM_ROLES in FormItemUtils.ts
  ROLE_VALUES = %w[normal confirmed_attendee team_member all_profiles_basic_access admin]

  belongs_to :form_section
  has_one :form, through: :form_section
  acts_as_list scope: :form_section

  validates :item_type, presence: true
  validates :item_type, inclusion: { in: PROPERTIES_SCHEMA.keys.map(&:to_s) }
  validate :ensure_unique_identifier_across_form
  validates :identifier, uniqueness: {
    allow_nil: true,
    conditions: -> { joins(:form_section) },
    scope: 'form_sections.form_id'
  }
  validate :ensure_properties_match_schema
  validates :visibility, inclusion: { in: ROLE_VALUES }
  validates :writeability, inclusion: { in: ROLE_VALUES }

  def self.highest_level_role(**role_hash)
    roles = Set.new(role_hash.select { |_, v| v }.keys.map(&:to_s))
    highest_explicit_role = ROLE_VALUES.reverse.find do |role|
      roles.include?(role)
    end
    highest_explicit_role || 'normal'
  end

  def self.role_is_at_least?(a, b)
    (ROLE_VALUES.index(a) || -1) >= (ROLE_VALUES.index(b) || -1)
  end

  def visible_to?(role)
    FormItem.role_is_at_least?(role, visibility)
  end

  def writeable_by?(role)
    visible_to?(role) && FormItem.role_is_at_least?(role, writeability)
  end

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
