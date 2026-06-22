# frozen_string_literal: true

require "test_helper"
require "base64"

# rubocop:disable Metrics/ClassLength, Metrics/BlockLength
class ImportConventionDataServiceTest < ActiveSupport::TestCase
  # Minimal valid export with no external dependencies (no CMS content set, no event categories)
  let(:base_data) do
    {
      version: "1",
      source_system: "other",
      convention: {
        name: "Import Test Con",
        domain: "importtest.example.com",
        timezone_name: "America/New_York",
        ticket_mode: "disabled",
        site_mode: "convention",
        starts_at: "2024-10-18T18:00:00-04:00",
        ends_at: "2024-10-20T15:00:00-04:00",
        show_schedule: "yes",
        show_event_list: "yes",
        maximum_event_signups: {
          always: "unlimited"
        },
        ticket_types: [],
        event_categories: [],
        rooms: [],
        staff_positions: []
      },
      users: [],
      user_con_profiles: [],
      events: [],
      event_proposals: [],
      runs: [],
      signups: [],
      team_members: [],
      tickets: [],
      store_items: [],
      store_orders: []
    }
  end

  let(:service) { ImportConventionDataService.new(data: base_data) }

  describe "convention creation" do
    before { @result = service.call! }

    it "succeeds" do
      assert @result.success?
    end

    it "creates a convention with the right name and domain" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert_equal "Import Test Con", convention.name
    end

    it "sets timezone" do
      assert_equal "America/New_York", Convention.find_by!(domain: "importtest.example.com").timezone_name
    end

    it "sets starts_at and ends_at" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert_equal Time.parse("2024-10-18T18:00:00-04:00"), convention.starts_at
      assert_equal Time.parse("2024-10-20T15:00:00-04:00"), convention.ends_at
    end

    it "sets ticket_mode and site_mode" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert_equal "disabled", convention.ticket_mode
      assert_equal "convention", convention.site_mode
    end
  end

  describe "signup rounds" do
    it "creates a single always-unlimited round" do
      service.call!
      convention = Convention.find_by!(domain: "importtest.example.com")
      rounds = convention.signup_rounds.to_a
      assert_equal 1, rounds.length
      assert_nil rounds.first.start
      assert_equal "unlimited", rounds.first.maximum_event_signups
    end

    it "creates multiple timed rounds from timespans" do
      data =
        base_data.merge(
          convention:
            base_data[:convention].merge(
              maximum_event_signups: {
                timespans: [
                  { start: nil, finish: "2024-09-01T00:00:00Z", value: "not_yet" },
                  { start: "2024-09-01T00:00:00Z", finish: nil, value: "unlimited" }
                ]
              }
            )
        )
      ImportConventionDataService.new(data: data).call!
      convention = Convention.find_by!(domain: "importtest.example.com")
      rounds = convention.signup_rounds.chronological.to_a
      assert_equal 2, rounds.length
      assert_nil rounds[0].start
      assert_equal "not_yet", rounds[0].maximum_event_signups
      assert_equal Time.parse("2024-09-01T00:00:00Z"), rounds[1].start
      assert_equal "unlimited", rounds[1].maximum_event_signups
    end
  end

  describe "user import" do
    let(:user_data) do
      base_data.merge(
        users: [
          { email: "alice@example.com", first_name: "Alice", last_name: "Smith" },
          {
            email: "bob@example.com",
            first_name: "Bob",
            last_name: "Jones",
            password_hash: "$2a$12$fakehash",
            password_hash_type: "bcrypt"
          },
          {
            email: "carol@example.com",
            first_name: "Carol",
            last_name: "White",
            password_hash: "$2a$12$md5wrapped",
            password_hash_type: "bcrypt_wrapped_md5"
          },
          {
            email: "dave@example.com",
            first_name: "Dave",
            last_name: "Brown",
            password_hash: "$2a$12$sha1wrapped",
            password_hash_type: "bcrypt_wrapped_sha1",
            password_sha1_salt: "abc123"
          }
        ]
      )
    end

    before { ImportConventionDataService.new(data: user_data).call! }

    it "creates users" do
      assert User.find_by(email: "alice@example.com")
      assert User.find_by(email: "bob@example.com")
    end

    it "sets first and last name" do
      alice = User.find_by!(email: "alice@example.com")
      assert_equal "Alice", alice.first_name
      assert_equal "Smith", alice.last_name
    end

    it "sets bcrypt password directly to encrypted_password" do
      bob = User.find_by!(email: "bob@example.com")
      assert_equal "$2a$12$fakehash", bob.encrypted_password
    end

    it "sets bcrypt_wrapped_md5 to legacy_password_md5" do
      carol = User.find_by!(email: "carol@example.com")
      assert_equal "$2a$12$md5wrapped", carol.legacy_password_md5
    end

    it "sets bcrypt_wrapped_sha1 to legacy_password_sha1 with salt" do
      dave = User.find_by!(email: "dave@example.com")
      assert_equal "$2a$12$sha1wrapped", dave.legacy_password_sha1
      assert_equal "abc123", dave.legacy_password_sha1_salt
    end

    it "does not create duplicate users for repeated emails" do
      assert_equal 1, User.where(email: "alice@example.com").count
    end
  end

  describe "user_con_profiles" do
    let(:data_with_profiles) do
      base_data.merge(
        users: [{ email: "alice@example.com", first_name: "Alice", last_name: "Smith" }],
        user_con_profiles: [
          {
            user_email: "alice@example.com",
            first_name: "Alice",
            last_name: "Smith",
            nickname: "Ally",
            city: "Boston",
            state: "MA"
          }
        ]
      )
    end

    before { ImportConventionDataService.new(data: data_with_profiles).call! }

    it "creates a user con profile" do
      user = User.find_by!(email: "alice@example.com")
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert convention.user_con_profiles.exists?(user: user)
    end

    it "stores profile attributes" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      profile = convention.user_con_profiles.joins(:user).find_by!(users: { email: "alice@example.com" })
      assert_equal "Ally", profile.nickname
      assert_equal "Boston", profile.city
      assert_equal "MA", profile.state
    end
  end

  describe "rooms" do
    before do
      data = base_data.deep_merge(convention: { rooms: [{ name: "Main Hall" }, { name: "Side Room" }] })
      ImportConventionDataService.new(data: data).call!
    end

    it "creates rooms" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert convention.rooms.find_by(name: "Main Hall")
      assert convention.rooms.find_by(name: "Side Room")
    end
  end

  describe "ticket types" do
    before do
      data =
        base_data.deep_merge(
          convention: {
            ticket_mode: "required_for_signup",
            ticket_types: [
              {
                name: "paid",
                description: "Paid badge",
                allows_event_signups: true,
                counts_towards_convention_maximum: true
              }
            ]
          }
        )
      ImportConventionDataService.new(data: data).call!
    end

    it "creates ticket types" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      tt = convention.ticket_types.find_by!(name: "paid")
      assert_equal "Paid badge", tt.description
      assert tt.allows_event_signups
      assert tt.counts_towards_convention_maximum
    end
  end

  describe "staff positions" do
    let(:data_with_staff) do
      base_data.merge(
        users: [{ email: "alice@example.com", first_name: "Alice", last_name: "Smith" }],
        user_con_profiles: [{ user_email: "alice@example.com", first_name: "Alice", last_name: "Smith" }],
        convention:
          base_data[:convention].merge(
            staff_positions: [
              {
                name: "Con Chair",
                email: "chair@example.com",
                visible: true,
                permissions: %w[read_reports read_event_proposals],
                user_emails: ["alice@example.com"]
              }
            ]
          )
      )
    end

    before { ImportConventionDataService.new(data: data_with_staff).call! }

    it "creates the staff position" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      sp = convention.staff_positions.find_by!(name: "Con Chair")
      assert_equal "chair@example.com", sp.email
      assert sp.visible
    end

    it "grants permissions to the staff position" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      sp = convention.staff_positions.find_by!(name: "Con Chair")
      granted = sp.permissions.map(&:permission).sort
      assert_includes granted, "read_reports"
      assert_includes granted, "read_event_proposals"
    end

    it "assigns users to the staff position" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      sp = convention.staff_positions.find_by!(name: "Con Chair")
      profile = convention.user_con_profiles.joins(:user).find_by!(users: { email: "alice@example.com" })
      assert_includes sp.user_con_profiles, profile
    end
  end

  # Shared CMS event categories used by multiple test groups
  let(:standard_event_categories) do
    [
      {
        name: "LARP",
        team_member_name: "GM",
        scheduling_ui: "regular",
        event_form_title: "Regular event form",
        event_proposal_form_title: "Proposal form"
      },
      {
        name: "Filler",
        team_member_name: "Organizer",
        scheduling_ui: "single_run",
        event_form_title: "Filler event form"
      }
    ]
  end

  describe "CMS content set loading and event categories" do
    let(:data_with_cms) do
      base_data.merge(
        cms_content_set: "standard",
        convention: base_data[:convention].merge(event_categories: standard_event_categories)
      )
    end

    before { ImportConventionDataService.new(data: data_with_cms).call! }

    it "loads forms from the CMS content set" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert convention.forms.find_by(title: "Regular event form")
    end

    it "creates event categories" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert convention.event_categories.find_by(name: "LARP")
      assert convention.event_categories.find_by(name: "Filler")
    end

    it "assigns the event form to each category" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      larp = convention.event_categories.find_by!(name: "LARP")
      assert_equal "Regular event form", larp.event_form.title
    end

    it "assigns the proposal form when specified" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      larp = convention.event_categories.find_by!(name: "LARP")
      assert_equal "Proposal form", larp.event_proposal_form.title
    end

    it "leaves proposal form nil when not specified" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      filler = convention.event_categories.find_by!(name: "Filler")
      assert_nil filler.event_proposal_form
    end
  end

  describe "CMS pages, partials, files, and navigation" do
    before do
      data =
        base_data.merge(
          cms_content_set: "standard",
          convention: base_data[:convention].merge(event_categories: standard_event_categories),
          cms_pages: [
            { name: "about", slug: "about", content: "<h1>About Us</h1>" },
            { name: "hotel", slug: "hotel", content: "<p>Stay here.</p>" }
          ],
          cms_partials: [{ name: "copyright", content: "&copy; 2024" }],
          cms_files: [
            { filename: "logo.png", content_base64: Base64.strict_encode64("fakepngdata"), content_type: "image/png" }
          ],
          cms_navigation_items: [
            {
              title: "About",
              links: [{ title: "About Us", page_name: "about" }, { title: "Hotel Info", page_name: "hotel" }]
            }
          ]
        )
      ImportConventionDataService.new(data: data).call!
    end

    it "creates pages" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert convention.pages.find_by(slug: "about")
      assert convention.pages.find_by(slug: "hotel")
    end

    it "overwrites a standard content set page when slugs match" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert_equal "<h1>About Us</h1>", convention.pages.find_by!(slug: "about").content
    end

    it "creates/overwrites partials by name" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      partial = convention.cms_partials.find_by(name: "copyright")
      assert partial
      assert_equal "&copy; 2024", partial.content
    end

    it "uploads CMS files" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      files = convention.cms_files.joins(file_attachment: :blob)
      assert files.exists?(active_storage_blobs: { filename: "logo.png" })
    end

    it "creates navigation sections with links" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      section = convention.cms_navigation_items.find_by(title: "About", page_id: nil)
      assert section
      assert_equal 2, CmsNavigationItem.where(navigation_section: section).count
    end

    it "links navigation items to pages" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      about_page = convention.pages.find_by!(slug: "about")
      assert convention.cms_navigation_items.find_by(title: "About Us", page: about_page)
    end

    it "skips navigation links for pages that do not exist" do
      missing_data =
        base_data.merge(convention: base_data[:convention].merge(domain: "navtest.example.com")).merge(
          cms_navigation_items: [{ title: "Info", links: [{ title: "Missing Page", page_name: "nonexistent" }] }]
        )
      ImportConventionDataService.new(data: missing_data).call!
      convention = Convention.find_by!(domain: "navtest.example.com")
      assert_equal 0, convention.cms_navigation_items.where(title: "Missing Page").count
    end

    it "does not re-upload a file that already exists from the content set" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      files = convention.cms_files.joins(file_attachment: :blob)
      assert_equal 1, files.where(active_storage_blobs: { filename: "logo.png" }).count
    end
  end

  describe "events, runs, and team members" do
    before do
      data =
        base_data.merge(
          cms_content_set: "standard",
          convention: base_data[:convention].merge(event_categories: standard_event_categories),
          users: [{ email: "gm@example.com", first_name: "Game", last_name: "Master" }],
          user_con_profiles: [{ user_email: "gm@example.com", first_name: "Game", last_name: "Master" }],
          events: [
            {
              id: "42",
              title: "A Great LARP",
              event_category_name: "LARP",
              status: "active",
              length_seconds: 14_400,
              can_play_concurrently: false,
              con_mail_destination: "gms",
              registration_policy: {
                buckets: [
                  {
                    key: "players",
                    name: "Players",
                    slots_limited: true,
                    total_slots: 10,
                    minimum_slots: 6,
                    preferred_slots: 10,
                    anything: false
                  }
                ],
                prevent_no_preference_signups: false
              }
            }
          ],
          runs: [{ event_id: "42", starts_at: "2024-10-19T10:00:00-04:00", room_names: [] }],
          team_members: [
            {
              event_id: "42",
              user_email: "gm@example.com",
              display: true,
              show_email: false,
              receive_con_email: true,
              receive_signup_email: "no"
            }
          ]
        )
      ImportConventionDataService.new(data: data).call!
    end

    it "creates the event" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert convention.events.find_by(title: "A Great LARP")
    end

    it "sets the event category" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      event = convention.events.find_by!(title: "A Great LARP")
      assert_equal "LARP", event.event_category.name
    end

    it "sets length_seconds" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert_equal 14_400, convention.events.find_by!(title: "A Great LARP").length_seconds
    end

    it "creates the registration policy with buckets" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      event = convention.events.find_by!(title: "A Great LARP")
      bucket = event.registration_policy.bucket_with_key("players")
      assert bucket
      assert_equal 10, bucket.total_slots
      assert bucket.slots_limited?
    end

    it "creates a run" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      event = convention.events.find_by!(title: "A Great LARP")
      assert_equal 1, event.runs.count
      assert_equal Time.parse("2024-10-19T10:00:00-04:00"), event.runs.first.starts_at
    end

    it "creates a team member" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      event = convention.events.find_by!(title: "A Great LARP")
      assert_equal 1, event.team_members.count
      tm = event.team_members.first
      assert tm.display
      assert tm.receive_con_email
    end
  end

  describe "signups" do
    before do
      data =
        base_data.merge(
          cms_content_set: "standard",
          convention: base_data[:convention].merge(event_categories: standard_event_categories),
          users: [{ email: "player@example.com", first_name: "Player", last_name: "One" }],
          user_con_profiles: [{ user_email: "player@example.com", first_name: "Player", last_name: "One" }],
          events: [
            {
              id: "99",
              title: "Signup Test LARP",
              event_category_name: "LARP",
              status: "active",
              length_seconds: 3600,
              con_mail_destination: "gms",
              registration_policy: {
                buckets: [
                  {
                    key: "players",
                    name: "Players",
                    slots_limited: true,
                    total_slots: 10,
                    minimum_slots: 1,
                    preferred_slots: 10,
                    anything: false
                  }
                ]
              }
            }
          ],
          runs: [{ event_id: "99", starts_at: "2024-10-19T14:00:00-04:00", room_names: [] }],
          signups: [
            {
              event_id: "99",
              run_index: 0,
              user_email: "player@example.com",
              state: "confirmed",
              bucket_key: "players",
              counted: true
            }
          ]
        )
      ImportConventionDataService.new(data: data).call!
    end

    it "creates the signup" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      event = convention.events.find_by!(title: "Signup Test LARP")
      assert_equal 1, event.runs.first.signups.confirmed.count
    end

    it "sets bucket_key and counted" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      event = convention.events.find_by!(title: "Signup Test LARP")
      signup = event.runs.first.signups.first
      assert_equal "players", signup.bucket_key
      assert signup.counted
    end
  end

  describe "tickets" do
    before do
      data =
        base_data.merge(
          cms_content_set: "standard",
          convention:
            base_data[:convention].merge(
              ticket_mode: "required_for_signup",
              event_categories: standard_event_categories,
              ticket_types: [{ name: "paid" }]
            ),
          users: [{ email: "attendee@example.com", first_name: "At", last_name: "Tendee" }],
          user_con_profiles: [{ user_email: "attendee@example.com", first_name: "At", last_name: "Tendee" }],
          tickets: [{ user_email: "attendee@example.com", ticket_type_name: "paid" }]
        )
      ImportConventionDataService.new(data: data).call!
    end

    it "creates the ticket" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      profile = convention.user_con_profiles.joins(:user).find_by!(users: { email: "attendee@example.com" })
      assert profile.ticket
      assert_equal "paid", profile.ticket.ticket_type.name
    end
  end

  describe "organization assignment" do
    it "assigns the convention to the provided organization" do
      org = Organization.create!(name: "Test Org")
      ImportConventionDataService.new(data: base_data, organization: org).call!
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert_equal org, convention.organization
    end
  end

  describe "CMS layouts" do
    before do
      data =
        base_data.merge(
          cms_layouts: [
            { name: "Default Layout", content: "<html>{{ content_for_layout }}</html>" },
            { name: "Minimal Layout", content: "{{ content_for_layout }}" }
          ],
          cms_pages: [
            { name: "Home", slug: "home", content: "Welcome", cms_layout_name: "Default Layout" },
            { name: "About", slug: "about", content: "About us" }
          ]
        )
      ImportConventionDataService.new(data: data).call!
    end

    it "creates layouts" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert convention.cms_layouts.find_by(name: "Default Layout")
      assert convention.cms_layouts.find_by(name: "Minimal Layout")
    end

    it "sets layout content" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      layout = convention.cms_layouts.find_by!(name: "Default Layout")
      assert_equal "<html>{{ content_for_layout }}</html>", layout.content
    end

    it "assigns cms_layout to a page when cms_layout_name is present" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      page = convention.pages.find_by!(slug: "home")
      assert_equal "Default Layout", page.cms_layout.name
    end

    it "leaves cms_layout nil when cms_layout_name is absent" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      page = convention.pages.find_by!(slug: "about")
      assert_nil page.cms_layout
    end
  end

  describe "store items with pricing" do
    before do
      data =
        base_data.merge(
          convention:
            base_data[:convention].merge(
              ticket_mode: "required_for_signup",
              ticket_types: [
                { name: "weekend_pass", allows_event_signups: true, counts_towards_convention_maximum: true }
              ]
            ),
          store_items: [
            {
              name: "Weekend Pass",
              available: true,
              price: {
                fractional: 5000,
                currency_code: "USD"
              },
              provides_ticket_type_name: "weekend_pass"
            },
            { name: "Free Volunteer Pass", available: true, provides_ticket_type_name: "weekend_pass" }
          ]
        )
      ImportConventionDataService.new(data: data).call!
    end

    it "creates products" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      assert convention.products.find_by(name: "Weekend Pass")
      assert convention.products.find_by(name: "Free Volunteer Pass")
    end

    it "sets pricing_structure to fixed with the given price" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      product = convention.products.find_by!(name: "Weekend Pass")
      assert_equal "fixed", product.pricing_structure.pricing_strategy
      assert_equal Money.new(5000, "USD"), product.pricing_structure.value
    end

    it "sets pricing_structure to a zero fixed price when no price is given" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      product = convention.products.find_by!(name: "Free Volunteer Pass")
      assert_equal "fixed", product.pricing_structure.pricing_strategy
      assert_equal Money.new(0, Money.default_currency), product.pricing_structure.value
    end

    it "sets payment_options to stripe when price is positive" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      product = convention.products.find_by!(name: "Weekend Pass")
      assert_equal ["stripe"], product.payment_options
    end

    it "sets payment_options to empty when price is zero" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      product = convention.products.find_by!(name: "Free Volunteer Pass")
      assert_equal [], product.payment_options
    end

    it "links provides_ticket_type to the named ticket type" do
      convention = Convention.find_by!(domain: "importtest.example.com")
      product = convention.products.find_by!(name: "Weekend Pass")
      assert_equal "weekend_pass", product.provides_ticket_type.name
    end
  end
end
# rubocop:enable Metrics/ClassLength, Metrics/BlockLength
