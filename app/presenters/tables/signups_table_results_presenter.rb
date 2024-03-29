# frozen_string_literal: true
class Tables::SignupsTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_run(run, pundit_user, filters, sort, visible_field_ids = nil)
    scope = SignupPolicy::Scope.new(pundit_user, run.signups.includes(:user_con_profile))
    new(scope.resolve, pundit_user, filters, sort, visible_field_ids)
  end

  def self.signup_spy_for_convention(convention, pundit_user)
    scope =
      SignupPolicy::Scope.new(
        pundit_user,
        convention
          .signups
          .joins(run: :event)
          .includes(user_con_profile: :signups, run: :event)
          .where(events: { convention_id: convention.id })
      )

    new(
      scope.resolve,
      pundit_user,
      {},
      [{ field: 'created_at', desc: true }],
      %w[name event_title state created_at choice]
    )
  end

  def self.format_bucket(bucket, requested_bucket)
    return "#{bucket.name} (no preference)" if bucket && !requested_bucket
    if requested_bucket && bucket != requested_bucket
      return "#{bucket&.name || 'None'} (requested #{requested_bucket.name})"
    end
    bucket&.name
  end

  field :id, 'Seq'

  field :state, 'State' do
    column_filter
  end

  field :name, 'Name' do
    def apply_filter(scope, value)
      scope
        .joins(:user_con_profile)
        .where(
          "lower(user_con_profiles.last_name) like :value \
OR lower(user_con_profiles.first_name) like :value",
          value: "%#{value.downcase}%"
        )
    end

    def expand_scope_for_sort(scope, _direction)
      scope.joins(:user_con_profile)
    end

    def sql_order(direction)
      "user_con_profiles.last_name #{direction}, user_con_profiles.first_name #{direction}"
    end

    def generate_csv_cell(signup)
      signup.user_con_profile.name_inverted
    end
  end

  field :event_title, 'Event' do
    def apply_filter(scope, value)
      run_scope = Run.where(id: scope.select(:run_id))
      event_scope = Names.string_search(Event.where(id: run_scope.select(:event_id)), value, ['title'])
      scope.joins(:run).where(runs: { event_id: event_scope.select(:id) })
    end

    def generate_csv_cell(signup)
      signup.run.event.title
    end
  end

  field :bucket, 'Bucket' do
    column_filter :bucket_key

    def sql_order(direction)
      "bucket_key #{direction}"
    end

    def generate_csv_cell(signup)
      Tables::SignupsTableResultsPresenter.format_bucket(signup.bucket, signup.requested_bucket)
    end
  end

  field :age_restrictions_check, 'Age check'

  field :age, 'Age' do
    delegate :pundit_user, to: :presenter

    def expand_scope_for_sort(scope, _direction)
      scope.joins(:user_con_profile)
    end

    def generate_csv_cell(signup)
      return unless UserConProfilePolicy.new(pundit_user, signup.user_con_profile).read_birth_date?
      signup.user_con_profile.age_as_of(signup.run.starts_at)
    end
  end

  field :email, 'Email' do
    def apply_filter(scope, value)
      scope.joins(user_con_profile: :user).where('lower(users.email) like :value', value: "%#{value.downcase}%")
    end

    def expand_scope_for_sort(scope, _direction)
      scope.joins(user_con_profile: :user)
    end

    def sql_order(direction)
      "users.email #{direction}"
    end

    def generate_csv_cell(signup)
      signup.user_con_profile.email
    end
  end

  field :created_at, 'Timestamp'

  field :choice, 'Choice' do
    def generate_csv_cell(signup)
      signup.counted? ? signup.choice : 'N/C'
    end
  end

  attr_reader :pundit_user

  def initialize(scope, pundit_user, *args)
    @pundit_user = pundit_user
    super(scope, *args)
  end

  private

  def csv_scope
    scoped.includes(user_con_profile: :user)
  end
end
