require 'sequel'

module Intercode
  module Import
    module Intercode1
      mattr_accessor :logger
      self.logger = Logger.new(STDERR)
      self.logger.formatter = Proc.new do |severity, time, progname, msg|
        "%10s %s - %s\n" % ["[#{severity}]", time.strftime('%H:%M:%S.%L'), msg]
      end

      class Importer
        attr_reader :connection

        def initialize(connection, con_name, con_domain)
          @connection = connection
          @con_name = con_name
          @con_domain = con_domain
        end

        def import!
          con_table = Intercode::Import::Intercode1::Tables::Con.new(connection, @con_name, @con_domain)
          con = con_table.build_con
          con.save!
          Intercode::Import::Intercode1.logger.info("Imported con as ID #{con.id}")

          events_table = Intercode::Import::Intercode1::Tables::Events.new(connection, con)
          events_table.import!

          users_table = Intercode::Import::Intercode1::Tables::Users.new(connection, con, events_table.event_id_map)
          users_table.import!
        end
      end

      class Table
        attr_reader :connection

        def initialize(connection)
          @connection = connection
        end

        def dataset
          connection[self.class.name.demodulize.to_sym]
        end

        def object_name
          @object_name ||= self.class.name.demodulize.singularize
        end

        def import!
          logger.info "Importing #{object_name.pluralize}"
          dataset.each do |row|
            record = build_record(row)
            logger.debug "Importing #{object_name} #{row_id(row)}"
            build_record(row).save!
          end
        end

        private
        def build_record(row)
        end

        def row_id(row)
        end

        def logger
          Intercode::Import::Intercode1.logger
        end

        def yn_to_bool(value)
          case value
          when 'Yes' then true
          when 'No' then false
          end
        end
      end

      module Tables
        class Con < Intercode::Import::Intercode1::Table
          def initialize(connection, con_name, con_domain)
            super(connection)
            @con_name = con_name
            @con_domain = con_domain
          end

          def build_con
            build_record(dataset.first)
          end

          private
          def build_record(row)
            Convention.new(
              name: @con_name,
              domain: @con_domain,
              signups_allowed: row[:SignupsAllowed].underscore,
              show_schedule: row[:ShowSchedule].underscore,
              news: row[:News],
              con_com_meetings: row[:ConComMeetings],
              accepting_bids: yn_to_bool(row[:AcceptingBids]),
              precon_bids_allowed: yn_to_bool(row[:PreconBidsAllowed])
            )
          end
        end

        class Events < Intercode::Import::Intercode1::Table
          attr_accessor :event_id_map

          def initialize(connection, con)
            super connection
            @con = con
            @event_id_map = {}
          end

          def dataset
            super.join(:Bids, :EventId => :EventId).select_all(:Events).select_append(:Status)
          end

          # TODO: Import signup constraints
          private
          def build_record(row)
            @event_id_map[row[:EventId]] = @con.events.new(
              title: row[:Title],
              author: row[:Author],
              email: row[:GameEMail],
              organization: row[:Organization],
              url: row[:Homepage],
              notify_on_changes: row[:NotifyOnChanges] == 'Y',
              length_seconds: row[:Hours] * 1.hour,
              can_play_concurrently: row[:CanPlayConcurrently] == 'Y',
              con_mail_destination: con_mail_destination(row),
              description: row[:Description],
              short_blurb: row[:ShortBlurb],
              category: event_category(row),
              status: event_status(row)
            )
          end

          def row_id(row)
            row[:EventId]
          end

          def con_mail_destination(row)
            case row[:ConMailDest]
            when 'GameMail' then 'event_email'
            when 'GMs' then 'gms'
            when nil then nil
            else raise "Unknown ConMailDest value: #{row[:ConMailDest]}"
            end
          end

          def event_category(row)
            if row[:IsOps] == 'Y' || row[:IsConSuite] == 'Y'
              return 'volunteer_event'
            end

            if row[:SpecialEvent] == 1
              return 'filler'
            end

            case row[:GameType]
            when 'Board Game' then 'board_game'
            when 'Panel' then 'panel'
            when 'Tabletop RPG' then 'tabletop_rpg'
            when 'Other' then nil
            else 'larp'
            end
          end

          def event_status(row)
            case row[:Status]
            when 'Pending' then 'proposed'
            when 'Under Review' then 'reviewing'
            when 'Accepted' then 'accepted'
            when 'Rejected' then 'rejected'
            when 'Dropped' then 'dropped'
            end
          end
        end

        class Users < Intercode::Import::Intercode1::Table
          USER_FIELD_MAP = {
            first_name: :FirstName,
            last_name: :LastName,
            nickname: :Nickname,
            address1: :Address1,
            address2: :Address2,
            city: :City,
            state: :State,
            zipcode: :Zipcode,
            country: :Country,
            day_phone: :DayPhone,
            evening_phone: :EvePhone,
            best_call_time: :BestTime
          }

          PRIV_MAP = {
            bid_committee: "BidCom",
            staff: "Staff",
            bid_chair: "BidChair",
            gm_liaison: "GMLiaison",
            registrar: "Registrar",
            outreach: "Outreach",
            con_com: "ConCom",
            scheduling: "Scheduling",
            mail_to_gms: "MailToGMs",
            mail_to_attendees: "MailToAttendes",
            mail_to_vendors: "MailToVendors",
            mail_to_unpaid: "MailToUnpaid",
            mail_to_alumni: "MailToAlumni"
          }

          PREFERRED_CONTACT_MAP = {
            "EMail" => :email,
            "DayPhone" => :day_phone,
            "EvePhone" => :evening_phone
          }

          def initialize(connection, con, event_id_map)
            super connection
            @con = con
            @event_id_map = event_id_map
          end

          def import!
            logger.info "Importing #{object_name.pluralize}"

            dataset.each do |row|
              user = build_user(row)
              logger.info "Importing User #{row[:UserId]}"
              user.save!

              user_con_profile = build_user_con_profile(row, @con, user)
              user_con_profile.save!
            end
          end

          private
          def build_user(row)
            User.find_or_initialize_by(email: row[:EMail].downcase).tap do |user|
              USER_FIELD_MAP.each do |new_field, old_field|
                next if user.send(new_field).present?
                user.send("#{new_field}=", row[old_field])
              end

              user.gender ||= row[:Gender].try(:downcase)
              user.preferred_contact ||= PREFERRED_CONTACT_MAP[row[:PreferredContact]]
              user.blank_password! unless user.encrypted_password.present?
            end
          end

          def build_user_con_profile(row, con, user)
            profile_attrs = {
              convention: con,
              registration_status: row[:CanSignup].try(:underscore),
              comp_event: imported_event(row[:CompEventId]),
              payment_amount_cents: row[:PaymentAmount],
              payment_amount_currency: (row[:PaymentAmount].to_i > 0 ? 'USD' : nil),
              payment_note: row[:PaymentNote]
            }.merge(priv_attributes(row))

            user.user_con_profiles.new(profile_attrs)
          end

          def priv_attributes(row)
            return {} unless row[:Priv]

            priv_attrs = PRIV_MAP.each_with_object({}) do |(new_priv, old_priv), priv_attributes|
              priv_attributes[new_priv] = row[:Priv].include?(old_priv)
            end

            if row[:Priv].include?('MailToAll')
              UserConProfile::MAIL_PRIV_NAMES.each do |priv_name|
                priv_attrs[priv_name] = true
              end
            end

            priv_attrs
          end

          def imported_event(old_event_id)
            return unless old_event_id
            @event_id_map[old_event_id]
          end
        end
      end
    end
  end
end