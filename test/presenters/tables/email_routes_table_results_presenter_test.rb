# frozen_string_literal: true
require "test_helper"

class Tables::EmailRoutesTableResultsPresenterTest < ActiveSupport::TestCase
  include TablePresenterTestHelper

  let(:route_a) { EmailRoute.create!(receiver_address: "info@example.com", forward_addresses: ["a@example.org"]) }
  let(:route_b) { EmailRoute.create!(receiver_address: "staff@example.com", forward_addresses: ["z@example.net"]) }

  before do
    route_a
    route_b
  end

  def build_presenter(filters: {}, sort: [], visible_field_ids: nil)
    Tables::EmailRoutesTableResultsPresenter.new(EmailRoute.all, filters, sort, visible_field_ids)
  end

  it "filters by receiver address and forward addresses" do
    assert_equal [route_a.id], filtered_ids(:receiver_address, "info")
    assert_equal [route_b.id], filtered_ids(:forward_addresses, "Z@EXAMPLE")
  end

  it "sorts" do
    assert_equal [route_a.id, route_b.id], sorted_ids(:receiver_address)
    assert_equal [route_b.id, route_a.id], sorted_ids(:forward_addresses, desc: true)
  end
end
