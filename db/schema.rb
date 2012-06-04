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
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120604142637) do

  create_table "events", :force => true do |t|
    t.string   "title"
    t.string   "author"
    t.string   "email"
    t.string   "organization"
    t.text     "url"
    t.boolean  "notify_on_changes"
    t.text     "player_constraints"
    t.integer  "length_seconds"
    t.boolean  "can_play_concurrently"
    t.text     "special_event_flags"
    t.string   "con_mail_destination"
    t.text     "description"
    t.text     "short_blurb"
    t.integer  "updated_by_id"
    t.datetime "created_at",            :null => false
    t.datetime "updated_at",            :null => false
  end

  add_index "events", ["updated_by_id"], :name => "index_events_on_updated_by_id"

  create_table "runs", :force => true do |t|
    t.integer  "event_id"
    t.datetime "starts_at"
    t.string   "title_suffix"
    t.text     "schedule_note"
    t.integer  "updated_by_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "runs", ["event_id"], :name => "index_runs_on_event_id"
  add_index "runs", ["updated_by_id"], :name => "index_runs_on_updated_by_id"

end
