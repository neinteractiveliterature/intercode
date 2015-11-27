# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20151116213829) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "conventions", force: :cascade do |t|
    t.string   "signups_allowed",     default: "not_yet", null: false
    t.string   "show_schedule",       default: "no",      null: false
    t.text     "news"
    t.text     "con_com_meetings"
    t.boolean  "accepting_bids"
    t.boolean  "precon_bids_allowed"
    t.integer  "updated_by_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.integer  "root_page_id"
    t.string   "name"
    t.string   "banner_image"
    t.string   "domain",                                  null: false
    t.string   "timezone_name"
  end

  add_index "conventions", ["domain"], name: "index_conventions_on_domain", unique: true, using: :btree
  add_index "conventions", ["updated_by_id"], name: "index_conventions_on_updated_by_id", using: :btree

  create_table "events", force: :cascade do |t|
    t.string   "title"
    t.string   "author"
    t.string   "email"
    t.string   "organization"
    t.text     "url"
    t.boolean  "notify_on_changes"
    t.text     "player_constraints"
    t.integer  "length_seconds"
    t.boolean  "can_play_concurrently"
    t.string   "con_mail_destination"
    t.text     "description"
    t.text     "short_blurb"
    t.integer  "updated_by_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "convention_id"
    t.integer  "owner_id"
    t.string   "status"
    t.string   "category"
    t.text     "registration_policy"
  end

  add_index "events", ["convention_id"], name: "index_events_on_convention_id", using: :btree
  add_index "events", ["owner_id"], name: "index_events_on_owner_id", using: :btree
  add_index "events", ["updated_by_id"], name: "index_events_on_updated_by_id", using: :btree

  create_table "pages", force: :cascade do |t|
    t.text     "name"
    t.string   "slug"
    t.text     "content"
    t.integer  "parent_id"
    t.string   "parent_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "pages", ["parent_type", "parent_id", "slug"], name: "index_pages_on_parent_type_and_parent_id_and_slug", unique: true, using: :btree

  create_table "rooms", force: :cascade do |t|
    t.integer  "convention_id"
    t.string   "name"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "rooms", ["convention_id"], name: "index_rooms_on_convention_id", using: :btree

  create_table "rooms_runs", id: false, force: :cascade do |t|
    t.integer "room_id", null: false
    t.integer "run_id",  null: false
  end

  add_index "rooms_runs", ["room_id"], name: "index_rooms_runs_on_room_id", using: :btree
  add_index "rooms_runs", ["run_id", "room_id"], name: "index_rooms_runs_on_run_id_and_room_id", unique: true, using: :btree
  add_index "rooms_runs", ["run_id"], name: "index_rooms_runs_on_run_id", using: :btree

  create_table "runs", force: :cascade do |t|
    t.integer  "event_id"
    t.datetime "starts_at"
    t.string   "title_suffix"
    t.text     "schedule_note"
    t.integer  "updated_by_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "runs", ["event_id"], name: "index_runs_on_event_id", using: :btree
  add_index "runs", ["updated_by_id"], name: "index_runs_on_updated_by_id", using: :btree

  create_table "sessions", force: :cascade do |t|
    t.string   "session_id", null: false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], name: "index_sessions_on_session_id", unique: true, using: :btree
  add_index "sessions", ["updated_at"], name: "index_sessions_on_updated_at", using: :btree

  create_table "signups", force: :cascade do |t|
    t.integer  "run_id"
    t.string   "bucket_key"
    t.integer  "updated_by_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.integer  "user_id"
  end

  add_index "signups", ["run_id"], name: "index_signups_on_run_id", using: :btree
  add_index "signups", ["updated_by_id"], name: "index_signups_on_updated_by_id", using: :btree
  add_index "signups", ["user_id"], name: "index_signups_on_user_id", using: :btree

  create_table "team_members", force: :cascade do |t|
    t.integer  "event_id"
    t.integer  "user_id"
    t.datetime "updated_at"
    t.integer  "updated_by_id"
    t.boolean  "display"
    t.boolean  "show_email"
    t.boolean  "receive_con_email"
    t.boolean  "receive_signup_email"
    t.datetime "created_at"
  end

  create_table "ticket_types", force: :cascade do |t|
    t.integer  "convention_id"
    t.text     "name"
    t.text     "description"
    t.text     "pricing_schedule"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  add_index "ticket_types", ["convention_id"], name: "index_ticket_types_on_convention_id", using: :btree

  create_table "tickets", force: :cascade do |t|
    t.integer  "user_con_profile_id"
    t.integer  "ticket_type_id"
    t.string   "charge_id"
    t.integer  "payment_amount_cents"
    t.string   "payment_amount_currency"
    t.text     "payment_note"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  add_index "tickets", ["charge_id"], name: "index_tickets_on_charge_id", unique: true, using: :btree
  add_index "tickets", ["ticket_type_id"], name: "index_tickets_on_ticket_type_id", using: :btree
  add_index "tickets", ["user_con_profile_id"], name: "index_tickets_on_user_con_profile_id", using: :btree

  create_table "user_con_profiles", force: :cascade do |t|
    t.integer  "user_id",                                    null: false
    t.integer  "convention_id",                              null: false
    t.string   "registration_status",     default: "unpaid", null: false
    t.integer  "comp_event_id"
    t.integer  "payment_amount_cents"
    t.string   "payment_amount_currency"
    t.text     "payment_note"
    t.boolean  "bid_committee",           default: false,    null: false
    t.boolean  "staff",                   default: false,    null: false
    t.boolean  "bid_chair",               default: false,    null: false
    t.boolean  "gm_liaison",              default: false,    null: false
    t.boolean  "registrar",               default: false,    null: false
    t.boolean  "outreach",                default: false,    null: false
    t.boolean  "con_com",                 default: false,    null: false
    t.boolean  "scheduling",              default: false,    null: false
    t.boolean  "mail_to_gms",             default: false,    null: false
    t.boolean  "mail_to_attendees",       default: false,    null: false
    t.boolean  "mail_to_vendors",         default: false,    null: false
    t.boolean  "mail_to_unpaid",          default: false,    null: false
    t.boolean  "mail_to_alumni",          default: false,    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_con_profiles", ["convention_id", "user_id"], name: "index_user_con_profiles_on_convention_id_and_user_id", unique: true, using: :btree
  add_index "user_con_profiles", ["registration_status"], name: "index_user_con_profiles_on_registration_status", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "first_name",                          null: false
    t.string   "last_name",                           null: false
    t.string   "nickname"
    t.date     "birth_date"
    t.string   "gender"
    t.string   "address1"
    t.string   "address2"
    t.string   "city"
    t.string   "state"
    t.string   "zipcode"
    t.string   "country"
    t.string   "day_phone"
    t.string   "evening_phone"
    t.string   "best_call_time"
    t.string   "preferred_contact"
    t.boolean  "site_admin"
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  add_foreign_key "conventions", "pages", column: "root_page_id"
  add_foreign_key "conventions", "users", column: "updated_by_id"
  add_foreign_key "events", "conventions"
  add_foreign_key "events", "users", column: "owner_id"
  add_foreign_key "events", "users", column: "updated_by_id"
  add_foreign_key "rooms", "conventions"
  add_foreign_key "rooms_runs", "rooms"
  add_foreign_key "rooms_runs", "runs"
  add_foreign_key "runs", "events"
  add_foreign_key "runs", "users", column: "updated_by_id"
  add_foreign_key "signups", "runs"
  add_foreign_key "signups", "users"
  add_foreign_key "signups", "users", column: "updated_by_id"
  add_foreign_key "team_members", "events"
  add_foreign_key "team_members", "users"
  add_foreign_key "ticket_types", "conventions"
  add_foreign_key "tickets", "ticket_types"
  add_foreign_key "tickets", "user_con_profiles"
  add_foreign_key "user_con_profiles", "conventions"
  add_foreign_key "user_con_profiles", "events", column: "comp_event_id"
  add_foreign_key "user_con_profiles", "users"
end
