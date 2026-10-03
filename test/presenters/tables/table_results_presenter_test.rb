# frozen_string_literal: true
require "test_helper"

class Tables::TableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

  # A presenter subclass over users, with a variety of field types, built fresh for each test
  let(:presenter_class) do
    Class.new(Tables::TableResultsPresenter) do
      field :id, "ID"

      field :first_name, "First name" do
        ilike_column_filter
      end

      field :email_address, "Email address" do
        ilike_column_filter :email
      end

      field :status_flag, "Status flag" do
        def filter_only?
          true
        end

        def apply_filter(scope, value)
          value ? scope.where(site_admin: true) : scope
        end
      end

      field :path_thing,
            "Path thing",
            (
              Class.new(Tables::TableResultsPresenter::Field) do
                def path_based?
                  true
                end

                def generate_csv_cell(user, path = nil)
                  "#{user.first_name}:#{path&.join("/")}"
                end
              end
            )

      field :plain_column, "Plain column" do
        def generate_csv_cell(user)
          user.first_name.upcase
        end
      end
    end
  end
  let(:alice) { create(:user, first_name: "Alice", email: "alice@example.com") }
  let(:bob) { create(:site_admin, first_name: "Bob", email: "bob@example.net") }

  before { alice && bob }

  before do
    alice
    bob
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil)
    presenter_class.new(User.where(id: [alice.id, bob.id]), filters, sort, visible_field_ids)
  end

  describe "filtering" do
    it "applies ilike column filters case-insensitively, using the field ID or an explicit column" do
      assert_equal [alice.id], filtered_ids(:first_name, "ALI")
      assert_equal [bob.id], filtered_ids(:email_address, "example.NET")
    end

    it "ignores blank values for ilike column filters" do
      assert_equal [alice.id, bob.id].sort, filtered_ids(:first_name, "").sort
    end

    it "ignores blank filters entirely" do
      assert_equal [alice.id, bob.id].sort, build_presenter(filters: nil).scoped.map(&:id).sort
    end

    it "describes the filters that were applied" do
      presenter = build_presenter(filters: { "first_name" => "ali", "email_address" => "example" })

      assert_equal ["First name: ali", "Email address: example"], presenter.filter_descriptions
    end
  end

  describe "sorting" do
    it "sorts ascending and descending by a column" do
      assert_equal [alice.id, bob.id], sorted_ids(:id)
      assert_equal [bob.id, alice.id], sorted_ids(:id, desc: true)
    end

    it "inverts sort directions for fields that ask for it" do
      field = presenter_class.field_classes[:id].new(build_presenter)

      assert_equal "DESC", field.send(:invert_sort_direction, "ASC")
      assert_equal "ASC", field.send(:invert_sort_direction, "DESC")
      assert_equal "ASC", field.send(:invert_sort_direction, :desc)
    end
  end

  describe "pagination" do
    it "defaults to the first page and caps the page size at 200" do
      presenter = build_presenter

      assert_equal 2, presenter.paginate.to_a.size
      assert_equal 1, presenter.paginate(page: 2, per_page: 1).to_a.size
      assert_equal 200, presenter.paginate(per_page: 1000).per_page
    end
  end

  describe "CSV export" do
    it "exports the visible fields in the requested order" do
      rows = csv_rows(%w[first_name id])

      assert_equal %w[Alice Bob], rows.drop(1).map(&:first).sort
    end

    it "does not export filter-only or path-based fields by default" do
      assert_equal %i[id first_name email_address plain_column], build_presenter.visible_field_ids
    end

    it "does not export filter-only fields even when requested explicitly" do
      assert_equal [["First name"]], csv_rows(%w[status_flag first_name]).map { |row| row.first(1) }.first(1)
    end

    it "exports path-based fields with the requested path" do
      rows = csv_rows(%w[path_thing.some.path])

      assert_equal ["some.path"], rows.first
      assert_includes rows.map(&:first), "Alice:some.path"
    end

    it "ignores unknown fields, paths on fields that are not path-based, and bare path-based fields" do
      rows = csv_rows(%w[unknown first_name plain_column.foo path_thing])

      assert_equal [["First name"]], rows.first(1)
    end

    it "uses the last path segment as the default header for path-based fields" do
      field = Tables::TableResultsPresenter::Field.new(build_presenter)

      assert_equal "leaf", field.csv_header_for_path(%w[branch leaf])
    end
  end

  describe ".field" do
    it "refuses to define the same field twice" do
      error = assert_raises(RuntimeError) { presenter_class.field(:id, "ID again") }

      assert_match(/already defined/, error.message)
    end

    it "avoids constant name collisions when naming field classes" do
      klass =
        Class.new(Tables::TableResultsPresenter) do
          const_set(:WidgetField, Class.new)
          field :widget, "Widget"
        end

      assert klass.const_defined?(:WidgetField1)
    end
  end

  describe "default field behavior" do
    it "returns the scope unchanged for filtering and sorting expansion" do
      field = Tables::TableResultsPresenter::Field.new(build_presenter)
      scope = User.all

      assert_same scope, field.apply_filter(scope, "anything")
      assert_same scope, field.expand_scope_for_sort(scope, "ASC")
    end
  end
end
