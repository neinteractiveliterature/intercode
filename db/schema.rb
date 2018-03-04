# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180304162934) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "cms_files", id: :serial, force: :cascade do |t|
    t.integer "parent_id"
    t.integer "uploader_id"
    t.string "file", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "parent_type"
    t.index ["parent_id", "file"], name: "index_cms_files_on_parent_id_and_file", unique: true
    t.index ["parent_id"], name: "index_cms_files_on_parent_id"
    t.index ["uploader_id"], name: "index_cms_files_on_uploader_id"
  end

  create_table "cms_layouts", force: :cascade do |t|
    t.string "parent_type"
    t.bigint "parent_id"
    t.text "name"
    t.text "content"
    t.text "navbar_classes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "admin_notes"
    t.index ["parent_type", "parent_id"], name: "index_cms_layouts_on_parent_type_and_parent_id"
  end

  create_table "cms_navigation_items", force: :cascade do |t|
    t.text "title"
    t.string "parent_type"
    t.bigint "parent_id"
    t.bigint "navigation_section_id"
    t.bigint "page_id"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["navigation_section_id"], name: "index_cms_navigation_items_on_navigation_section_id"
    t.index ["page_id"], name: "index_cms_navigation_items_on_page_id"
    t.index ["parent_type", "parent_id"], name: "index_cms_navigation_items_on_parent_type_and_parent_id"
  end

  create_table "cms_partials", id: :serial, force: :cascade do |t|
    t.integer "parent_id"
    t.string "name", null: false
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "parent_type"
    t.text "admin_notes"
    t.index ["parent_id", "parent_type", "name"], name: "index_cms_partials_on_parent_id_and_parent_type_and_name", unique: true
    t.index ["parent_id", "parent_type"], name: "index_cms_partials_on_parent_id_and_parent_type"
  end

  create_table "conventions", id: :serial, force: :cascade do |t|
    t.string "show_schedule", default: "no", null: false
    t.boolean "accepting_proposals"
    t.integer "updated_by_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.integer "root_page_id"
    t.string "name"
    t.string "banner_image"
    t.string "domain", null: false
    t.string "timezone_name"
    t.text "maximum_event_signups"
    t.bigint "event_proposal_form_id"
    t.integer "maximum_tickets"
    t.bigint "default_layout_id"
    t.bigint "user_con_profile_form_id"
    t.string "ticket_name", default: "ticket", null: false
    t.bigint "regular_event_form_id"
    t.bigint "volunteer_event_form_id"
    t.bigint "filler_event_form_id"
    t.index ["default_layout_id"], name: "index_conventions_on_default_layout_id"
    t.index ["domain"], name: "index_conventions_on_domain", unique: true
    t.index ["event_proposal_form_id"], name: "index_conventions_on_event_proposal_form_id"
    t.index ["filler_event_form_id"], name: "index_conventions_on_filler_event_form_id"
    t.index ["regular_event_form_id"], name: "index_conventions_on_regular_event_form_id"
    t.index ["updated_by_id"], name: "index_conventions_on_updated_by_id"
    t.index ["user_con_profile_form_id"], name: "index_conventions_on_user_con_profile_form_id"
    t.index ["volunteer_event_form_id"], name: "index_conventions_on_volunteer_event_form_id"
  end

  create_table "event_proposals", force: :cascade do |t|
    t.bigint "convention_id"
    t.bigint "owner_id"
    t.bigint "event_id"
    t.string "status"
    t.text "title"
    t.text "email"
    t.integer "length_seconds"
    t.text "description"
    t.text "short_blurb"
    t.text "registration_policy"
    t.boolean "can_play_concurrently"
    t.text "additional_info"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "timeblock_preferences"
    t.datetime "submitted_at"
    t.index ["convention_id"], name: "index_event_proposals_on_convention_id"
    t.index ["event_id"], name: "index_event_proposals_on_event_id"
    t.index ["owner_id"], name: "index_event_proposals_on_owner_id"
  end

  create_table "events", id: :serial, force: :cascade do |t|
    t.string "title"
    t.string "author"
    t.string "email"
    t.string "organization"
    t.text "url"
    t.integer "length_seconds"
    t.boolean "can_play_concurrently"
    t.string "con_mail_destination"
    t.text "description"
    t.text "short_blurb"
    t.integer "updated_by_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "convention_id"
    t.integer "owner_id"
    t.string "status", default: "active", null: false
    t.string "category"
    t.text "registration_policy"
    t.text "participant_communications"
    t.text "age_restrictions"
    t.text "content_warnings"
    t.text "additional_info"
    t.index ["convention_id"], name: "index_events_on_convention_id"
    t.index ["owner_id"], name: "index_events_on_owner_id"
    t.index ["updated_by_id"], name: "index_events_on_updated_by_id"
  end

  create_table "form_items", force: :cascade do |t|
    t.bigint "form_section_id"
    t.integer "position"
    t.text "identifier"
    t.text "item_type"
    t.text "properties"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "admin_description"
    t.text "default_value"
    t.index ["form_section_id"], name: "index_form_items_on_form_section_id"
  end

  create_table "form_response_changes", force: :cascade do |t|
    t.bigint "user_con_profile_id", null: false
    t.string "field_identifier", null: false
    t.text "previous_value"
    t.text "new_value"
    t.datetime "notified_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "response_type"
    t.bigint "response_id"
    t.index ["notified_at"], name: "index_form_response_changes_on_notified_at"
    t.index ["response_type", "response_id"], name: "index_form_response_changes_on_response_type_and_response_id"
    t.index ["user_con_profile_id"], name: "index_form_response_changes_on_user_con_profile_id"
  end

  create_table "form_sections", force: :cascade do |t|
    t.bigint "form_id"
    t.text "title"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["form_id"], name: "index_form_sections_on_form_id"
  end

  create_table "forms", force: :cascade do |t|
    t.text "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "convention_id"
    t.index ["convention_id"], name: "index_forms_on_convention_id"
  end

  create_table "maximum_event_provided_tickets_overrides", force: :cascade do |t|
    t.bigint "event_id"
    t.bigint "ticket_type_id"
    t.integer "override_value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "idx_max_event_provided_tickets_on_event_id"
    t.index ["ticket_type_id"], name: "idx_max_event_provided_tickets_on_ticket_type_id"
  end

  create_table "pages", id: :serial, force: :cascade do |t|
    t.text "name"
    t.string "slug"
    t.text "content"
    t.integer "parent_id"
    t.string "parent_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.bigint "cms_layout_id"
    t.text "admin_notes"
    t.index ["cms_layout_id"], name: "index_pages_on_cms_layout_id"
    t.index ["parent_type", "parent_id", "slug"], name: "index_pages_on_parent_type_and_parent_id_and_slug", unique: true
  end

  create_table "rooms", id: :serial, force: :cascade do |t|
    t.integer "convention_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["convention_id"], name: "index_rooms_on_convention_id"
  end

  create_table "rooms_runs", id: false, force: :cascade do |t|
    t.integer "room_id", null: false
    t.integer "run_id", null: false
    t.index ["room_id"], name: "index_rooms_runs_on_room_id"
    t.index ["run_id", "room_id"], name: "index_rooms_runs_on_run_id_and_room_id", unique: true
    t.index ["run_id"], name: "index_rooms_runs_on_run_id"
  end

  create_table "runs", id: :serial, force: :cascade do |t|
    t.integer "event_id"
    t.datetime "starts_at"
    t.string "title_suffix"
    t.text "schedule_note"
    t.integer "updated_by_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["event_id"], name: "index_runs_on_event_id"
    t.index ["updated_by_id"], name: "index_runs_on_updated_by_id"
  end

  create_table "sessions", id: :serial, force: :cascade do |t|
    t.string "session_id", null: false
    t.text "data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["session_id"], name: "index_sessions_on_session_id", unique: true
    t.index ["updated_at"], name: "index_sessions_on_updated_at"
  end

  create_table "signups", id: :serial, force: :cascade do |t|
    t.integer "run_id"
    t.string "bucket_key"
    t.integer "updated_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_con_profile_id", null: false
    t.string "state", default: "confirmed", null: false
    t.boolean "counted"
    t.string "requested_bucket_key"
    t.index ["run_id"], name: "index_signups_on_run_id"
    t.index ["updated_by_id"], name: "index_signups_on_updated_by_id"
    t.index ["user_con_profile_id"], name: "index_signups_on_user_con_profile_id"
  end

  create_table "staff_positions", id: :serial, force: :cascade do |t|
    t.integer "convention_id"
    t.text "name"
    t.text "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "visible"
    t.index ["convention_id"], name: "index_staff_positions_on_convention_id"
    t.index ["visible"], name: "index_staff_positions_on_visible"
  end

  create_table "staff_positions_user_con_profiles", id: false, force: :cascade do |t|
    t.bigint "staff_position_id", null: false
    t.bigint "user_con_profile_id", null: false
  end

  create_table "team_members", id: :serial, force: :cascade do |t|
    t.integer "event_id"
    t.datetime "updated_at"
    t.integer "updated_by_id"
    t.boolean "display"
    t.boolean "show_email"
    t.boolean "receive_con_email"
    t.boolean "receive_signup_email"
    t.datetime "created_at"
    t.integer "user_con_profile_id", null: false
    t.index ["user_con_profile_id"], name: "index_team_members_on_user_con_profile_id"
  end

  create_table "ticket_types", id: :serial, force: :cascade do |t|
    t.integer "convention_id"
    t.text "name"
    t.text "description"
    t.text "pricing_schedule"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "publicly_available", default: true, null: false
    t.boolean "counts_towards_convention_maximum", default: true, null: false
    t.integer "maximum_event_provided_tickets", default: 0, null: false
    t.boolean "allows_event_signups", default: true, null: false
    t.index ["convention_id"], name: "index_ticket_types_on_convention_id"
  end

  create_table "tickets", id: :serial, force: :cascade do |t|
    t.integer "user_con_profile_id"
    t.integer "ticket_type_id"
    t.string "charge_id"
    t.integer "payment_amount_cents"
    t.string "payment_amount_currency"
    t.text "payment_note"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "provided_by_event_id"
    t.index ["charge_id"], name: "index_tickets_on_charge_id", unique: true
    t.index ["provided_by_event_id"], name: "index_tickets_on_provided_by_event_id"
    t.index ["ticket_type_id"], name: "index_tickets_on_ticket_type_id"
    t.index ["user_con_profile_id"], name: "index_tickets_on_user_con_profile_id"
  end

  create_table "user_con_profiles", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "convention_id", null: false
    t.boolean "proposal_committee", default: false, null: false
    t.boolean "staff", default: false, null: false
    t.boolean "proposal_chair", default: false, null: false
    t.boolean "gm_liaison", default: false, null: false
    t.boolean "registrar", default: false, null: false
    t.boolean "outreach", default: false, null: false
    t.boolean "con_com", default: false, null: false
    t.boolean "scheduling", default: false, null: false
    t.boolean "mail_to_gms", default: false, null: false
    t.boolean "mail_to_attendees", default: false, null: false
    t.boolean "mail_to_vendors", default: false, null: false
    t.boolean "mail_to_unpaid", default: false, null: false
    t.boolean "mail_to_alumni", default: false, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "nickname"
    t.date "birth_date"
    t.string "gender"
    t.string "city"
    t.string "state"
    t.string "zipcode"
    t.string "country"
    t.string "day_phone"
    t.string "evening_phone"
    t.string "best_call_time"
    t.string "preferred_contact"
    t.text "bio"
    t.boolean "show_nickname_in_bio"
    t.text "address"
    t.text "additional_info"
    t.boolean "receive_whos_free_emails", default: true, null: false
    t.boolean "gravatar_enabled", default: false, null: false
    t.index ["convention_id", "user_id"], name: "index_user_con_profiles_on_convention_id_and_user_id", unique: true
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.boolean "site_admin"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text "legacy_password_md5"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "cms_files", "users", column: "uploader_id"
  add_foreign_key "cms_navigation_items", "cms_navigation_items", column: "navigation_section_id"
  add_foreign_key "cms_navigation_items", "pages"
  add_foreign_key "conventions", "cms_layouts", column: "default_layout_id"
  add_foreign_key "conventions", "forms", column: "event_proposal_form_id"
  add_foreign_key "conventions", "forms", column: "filler_event_form_id"
  add_foreign_key "conventions", "forms", column: "regular_event_form_id"
  add_foreign_key "conventions", "forms", column: "user_con_profile_form_id"
  add_foreign_key "conventions", "forms", column: "volunteer_event_form_id"
  add_foreign_key "conventions", "pages", column: "root_page_id"
  add_foreign_key "conventions", "users", column: "updated_by_id"
  add_foreign_key "event_proposals", "conventions"
  add_foreign_key "event_proposals", "events"
  add_foreign_key "event_proposals", "user_con_profiles", column: "owner_id"
  add_foreign_key "events", "conventions"
  add_foreign_key "events", "users", column: "owner_id"
  add_foreign_key "events", "users", column: "updated_by_id"
  add_foreign_key "form_items", "form_sections"
  add_foreign_key "form_response_changes", "user_con_profiles"
  add_foreign_key "form_sections", "forms"
  add_foreign_key "forms", "conventions"
  add_foreign_key "maximum_event_provided_tickets_overrides", "events"
  add_foreign_key "maximum_event_provided_tickets_overrides", "ticket_types"
  add_foreign_key "pages", "cms_layouts"
  add_foreign_key "rooms", "conventions"
  add_foreign_key "rooms_runs", "rooms"
  add_foreign_key "rooms_runs", "runs"
  add_foreign_key "runs", "events"
  add_foreign_key "runs", "users", column: "updated_by_id"
  add_foreign_key "signups", "runs"
  add_foreign_key "signups", "user_con_profiles"
  add_foreign_key "signups", "users", column: "updated_by_id"
  add_foreign_key "staff_positions", "conventions"
  add_foreign_key "team_members", "events"
  add_foreign_key "team_members", "user_con_profiles"
  add_foreign_key "ticket_types", "conventions"
  add_foreign_key "tickets", "events", column: "provided_by_event_id"
  add_foreign_key "tickets", "ticket_types"
  add_foreign_key "tickets", "user_con_profiles"
  add_foreign_key "user_con_profiles", "conventions"
  add_foreign_key "user_con_profiles", "users"
end
