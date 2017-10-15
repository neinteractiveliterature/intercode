Types::EventType = GraphQL::ObjectType.define do
  name "Event"

  field :id, !types.Int
  field :title, types.String
  field :author, types.String
  field :email, types.String
  field :organization, types.String
  field :category, types.String
  field :url, types.String
  field :participant_communications, types.String
  field :length_seconds, types.Int
  field :can_play_concurrently, types.Boolean
  field :con_mail_destination, types.String
  field :description, types.String
  field :short_blurb, types.String
  field :status, types.String
  field :runs, types[Types::RunType]

  field :registration_policy, Types::RegistrationPolicyType

  field :slots_limited, types.Boolean do
    resolve -> (obj, _args, _ctx) {
      obj.registration_policy.slots_limited?
    }
  end

  field :total_slots, types.Int do
    resolve -> (obj, _args, _ctx) {
      obj.registration_policy.total_slots
    }
  end

  field :short_blurb_html, types.String do
    resolve ->(obj, _args, _ctx) {
      MarkdownPresenter.new('No blurb provided').render obj.short_blurb
    }
  end

  field :description_html, types.String do
    resolve ->(obj, _args, _ctx) {
      MarkdownPresenter.new('No description provided').render obj.description
    }
  end

  field :event_page_url, types.String do
    resolve ->(obj, _args, _ctx) {
      Rails.application.routes.url_helpers.event_path(obj)
    }
  end
end
