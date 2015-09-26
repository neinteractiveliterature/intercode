require 'sequel'

module Intercode
  module Import
    module Intercode1
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
          
          # FIXME: replace the event map with an actual event map once we can import events
          users_table = Intercode::Import::Intercode1::Tables::Users.new(connection, con, {})
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
        
        def import!
          dataset.each do |row|
            build_record(row).save!
          end
        end
        
        private
        def build_record(row)
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
            dataset.each do |row|
              user = build_user(row)
              user.save!
              
              build_user_con_profile(row, @con, user).save!
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