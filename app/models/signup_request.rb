class SignupRequest < ApplicationRecord
  belongs_to :user_con_profile
  belongs_to :target_run, class_name: 'Run'
  belongs_to :replace_signup, class_name: 'Signup', optional: true
  belongs_to :result_signup, class_name: 'Signup', optional: true
  belongs_to :updated_by, class_name: 'User'
  has_one :convention, through: :user_con_profile

  validates :state, presence: true, inclusion: { in: Types::SignupRequestStateType.values.keys }
  validate :ensure_all_fields_point_at_the_same_convention
  validates :result_signup,
    presence: { if: ->(signup_request) { signup_request.state == 'accepted' } }

  def to_liquid
    SignupRequestDrop.new(self)
  end

  private

  def ensure_all_fields_point_at_the_same_convention
    %i[target_run replace_signup result_signup].each do |field|
      value = public_send(field)
      next unless value && value.convention != convention

      errors.add field,
        "is in #{value.convention.name} but the attendee profile is in #{convention.name}"
    end
  end
end
