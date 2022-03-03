# frozen_string_literal: true
class MergeUsersService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :winning_user
  end
  self.result_class = Result

  USER_CON_PROFILE_REFERENCES = [
    { model: EventProposal, field: :owner_id },
    { model: EventRating, field: :user_con_profile_id },
    { model: FormResponseChange, field: :user_con_profile_id },
    { model: Order, field: :user_con_profile_id },
    { model: Signup, field: :user_con_profile_id },
    { model: SignupChange, field: :user_con_profile_id },
    { model: SignupRequest, field: :user_con_profile_id },
    { model: TeamMember, field: :user_con_profile_id },
    { model: Ticket, field: :user_con_profile_id }
  ].freeze

  RECORD_KEEPING_FIELDS = [
    { model: CmsFile, field: :uploader_id },
    { model: Convention, field: :updated_by_id },
    { model: Event, field: :updated_by_id },
    { model: Event, field: :owner_id },
    { model: Run, field: :updated_by_id },
    { model: Signup, field: :updated_by_id },
    { model: SignupChange, field: :updated_by_id },
    { model: UserActivityAlert, field: :user_id }
  ].freeze

  attr_reader :user_ids, :winning_user_id, :winning_user_con_profile_ids_by_convention_id

  validates_presence_of :user_ids, :winning_user_id
  validate :ensure_winning_user_id_is_in_user_ids
  validate :ensure_all_winning_user_con_profiles_exist
  validate :ensure_fully_disambiguated

  def initialize(user_ids:, winning_user_id:, winning_user_con_profile_ids_by_convention_id:)
    @user_ids = user_ids
    @winning_user_id = winning_user_id
    @winning_user_con_profile_ids_by_convention_id = winning_user_con_profile_ids_by_convention_id
  end

  private

  def inner_call
    winning_user.update!(site_admin: true) if users.any?(&:site_admin?)

    users.each { |user| merge_losing_profiles(user) }

    merge_record_keeping_fields
    merge_winning_profiles

    users.each { |user| user.destroy! unless user == winning_user }

    success(winning_user: winning_user.reload)
  end

  def merge_losing_profiles(user)
    user.user_con_profiles.each do |profile|
      next if profiles_by_convention_id[profile.convention_id].size < 2

      merge_profile_if_losing(profile)
    end
  end

  def merge_profile_if_losing(profile)
    winning_profile_for_convention = winning_profiles_by_convention_id[profile.convention_id]
    return if winning_profile_for_convention.id == profile.id

    USER_CON_PROFILE_REFERENCES.each do |reference|
      model = reference[:model]
      field = reference[:field]
      model.where(field => profile.id).update_all(field => winning_profile_for_convention.id)
    end

    profile.staff_positions.each { |staff_position| winning_profile_for_convention.staff_positions << staff_position }

    profile.destroy!
  end

  def merge_record_keeping_fields
    RECORD_KEEPING_FIELDS.each do |record_keeping_field|
      model = record_keeping_field[:model]
      field = record_keeping_field[:field]
      model.where(field => losing_user_ids).update_all(field => winning_user_id)
    end
  end

  def merge_winning_profiles
    UserConProfile.where(id: winning_user_con_profiles.map(&:id)).update_all(user_id: winning_user_id)
  end

  def ensure_winning_user_id_is_in_user_ids
    return if user_ids.include?(winning_user_id)
    errors.add :base, 'Winning user ID is not included in user IDs'
  end

  def ensure_all_winning_user_con_profiles_exist
    winning_user_con_profile_ids_by_convention_id.each_value do |profile_id|
      next if users.any? { |user| user.user_con_profiles.any? { |p| p.id == profile_id } }
      errors.add :base, "Can't find user con profile for ID #{profile_id}"
    end
  end

  def ensure_fully_disambiguated
    ambiguous_convention_ids.each do |convention_id|
      next if winning_profiles_by_convention_id[convention_id]

      errors.add :base, "Convention #{convention_id} is not disambiguated"
    end
  end

  def users
    @users ||= User.includes(user_con_profiles: :convention).find(user_ids)
  end

  def winning_user
    @winning_user ||= users.find { |user| user.id == winning_user_id }
  end

  def losing_user_ids
    @losing_user_ids ||= user_ids - [winning_user_id]
  end

  def conventions
    @conventions ||= users.flat_map(&:user_con_profiles).flat_map(&:convention).uniq
  end

  def profiles_by_convention_id
    @profiles_by_convention_id ||=
      conventions
        .index_by(&:id)
        .transform_values do |convention|
          users.flat_map(&:user_con_profiles).select { |p| p.convention_id == convention.id }
        end
  end

  def ambiguous_convention_ids
    @ambiguous_convention_ids ||= profiles_by_convention_id.select { |_convention_id, profiles| profiles.size > 1 }.keys
  end

  def winning_profiles_by_convention_id
    @winning_profiles_by_convention_id ||=
      profiles_by_convention_id.transform_values do |profiles|
        profiles.find { |profile| profile.id == winning_user_con_profile_ids_by_convention_id[profile.convention.id] }
      end
  end

  def winning_user_con_profiles
    @winning_user_con_profiles ||=
      winning_profiles_by_convention_id.map do |convention_id, profile|
        profile || profiles_by_convention_id[convention_id].first
      end
  end
end
