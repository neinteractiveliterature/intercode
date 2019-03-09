Types::EventType = GraphQL::ObjectType.define do
  name 'Event'

  field :id, !types.Int
  field :form_response_attrs_json, Types::Json do
    resolve -> (obj, _args, ctx) do
      AssociationLoader.for(Event, :event_category).load(obj).then do |event_category|
        AssociationLoader.for(EventCategory, :event_form).load(event_category)
      end.then do |form|
        FormResponsePresenter.new(form, obj).as_json
      end
    end
  end
  field :form_response_attrs_json_with_rendered_markdown, Types::Json do
    resolve -> (obj, _args, ctx) do
      AssociationLoader.for(Event, :event_category).load(obj).then do |event_category|
        AssociationLoader.for(EventCategory, :event_form).load(event_category)
      end.then do |form|
        FormResponsePresenter.new(form, obj).as_json_with_rendered_markdown('event', obj, '')
      end
    end
  end

  field :title, types.String
  field :author, types.String
  field :email, types.String
  field :organization, types.String
  field :url, types.String
  field :participant_communications, types.String
  field :age_restrictions, types.String
  field :content_warnings, types.String
  field :length_seconds, types.Int
  field :can_play_concurrently, types.Boolean
  field :con_mail_destination, types.String
  field :description, types.String
  field :short_blurb, types.String
  field :status, types.String
  field :private_signup_list, types.Boolean
  field :form, Types::FormType
  field :created_at, Types::DateType

  field :runs, !types[!Types::RunType] do
    argument :start, Types::DateType
    argument :finish, Types::DateType

    resolve -> (obj, args, ctx) do
      EventRunsLoader.for(args[:start], args[:finish], ctx[:current_ability]).load(obj)
    end
  end
  field :run, !Types::RunType do
    argument :id, !types.Int
    guard -> (event, args, ctx) do
      ctx[:current_ability].can?(:read, event.runs.find(args[:id]))
    end
    resolve -> (event, args, _ctx) do
      event.runs.find(args[:id])
    end
  end
  field :event_category, Types::EventCategoryType.to_non_null_type do
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(Event, :event_category).load(obj)
    }
  end
  field :team_members, Types::TeamMemberType.to_list_type.to_non_null_type do
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(Event, :team_members).load(obj)
    }
  end
  field :provided_tickets, Types::TicketType.to_non_null_type.to_list_type.to_non_null_type do
    guard -> (event, _args, ctx) do
      ctx[:current_ability].can?(
        :read,
        Ticket.new(
          user_con_profile: UserConProfile.new(convention: ctx[:convention]),
          provided_by_event: event
        )
      )
    end
  end
  field :can_provide_tickets, !types.Boolean do
    deprecation_reason 'Plaese use event_category.can_provide_tickets instead'
    resolve -> (obj, _args, _ctx) {
      obj.event_category.can_provide_tickets?
    }
  end
  override_type = Types::MaximumEventProvidedTicketsOverrideType
  field :maximum_event_provided_tickets_overrides, override_type.to_non_null_type.to_list_type.to_non_null_type do
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(Event, :maximum_event_provided_tickets_overrides).load(obj)
    }
  end

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
      MarkdownLoader.for('event', 'No information provided').load([[obj, 'short_blurb_html'], obj.short_blurb])
    }
  end

  field :description_html, types.String do
    resolve ->(obj, _args, _ctx) {
      MarkdownLoader.for('event', 'No information provided').load([[obj, 'description_html'], obj.description])
    }
  end

  field :admin_notes, types.String do
    guard -> (obj, _args, ctx) do
      ctx[:current_ability].can?(:read_admin_notes, obj)
    end
  end

  field :category, !types.String do
    deprecation_reason 'Please use event_category instead'
    resolve ->(obj, _args, _ctx) {
      obj.event_category.name.underscore
    }
  end

  field :team_member_name, !types.String do
    deprecation_reason 'Please use event_category.team_member_name instead'
    resolve ->(obj, _args, _ctx) {
      obj.event_category.team_member_name
    }
  end
end
