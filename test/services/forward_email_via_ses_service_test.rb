# frozen_string_literal: true
require "test_helper"

class ForwardEmailViaSesServiceTest < ActiveSupport::TestCase
  let(:convention) { create(:convention, domain: "example.com") }
  let(:ses_client) { Aws::SES::Client.new(stub_responses: true, region: "us-east-1") }
  let(:mailer_host) { Rails.application.config.action_mailer.default_url_options[:host] }

  setup { convention }

  def raw_email(from: "Alice Sender <alice@gmail.com>", to: "staff@example.com", subject: "Hello")
    <<~EMAIL
      From: #{from}
      To: #{to}
      Cc: someone-else@gmail.com
      Subject: #{subject}
      Return-Path: <alice@gmail.com>
      Sender: bounce-handler@gmail.com
      DKIM-Signature: v=1; a=rsa-sha256; d=gmail.com
      Message-ID: <abc@gmail.com>

      Body text
    EMAIL
  end

  def forward(recipients, email: raw_email, message_id: "ses-message-1")
    ForwardEmailViaSesService.stub(:ses_client, ses_client) do
      ForwardEmailViaSesService.new(recipients:, load_email: -> { email }, message_id:).call!
    end
  end

  def sent(operation)
    ses_client.api_requests.select { |request| request[:operation_name] == operation }.pluck(:params)
  end

  def staff_position_with_members(email: "staff@example.com", emails: %w[member1@gmail.com member2@gmail.com], **attrs)
    staff_position = create(:staff_position, convention:, email:, **attrs)
    emails.each do |member_email|
      user = create(:user, email: member_email)
      staff_position.user_con_profiles << create(:user_con_profile, convention:, user:)
    end
    staff_position
  end

  describe "an address that is routed somewhere" do
    setup { staff_position_with_members(cc_addresses: ["cc@gmail.com"]) }

    it "forwards the message to everyone the address routes to" do
      forward(["staff@example.com"])

      assert_equal 1, sent(:send_raw_email).size
      message = Mail.read_from_string(sent(:send_raw_email).first[:raw_message][:data])
      assert_equal %w[cc@gmail.com member1@gmail.com member2@gmail.com], message.to.sort
      assert_empty message.cc.to_a
      assert_empty message.bcc.to_a
    end

    it "sends it from the original recipient address, crediting the original sender in the display name" do
      forward(["staff@example.com"])

      message = Mail.read_from_string(sent(:send_raw_email).first[:raw_message][:data])
      assert_equal ["staff@example.com"], message.from
      # (Mail's #from only gives bare addresses, so the sender's own display name isn't carried over)
      assert_equal "alice@gmail.com via staff@example.com", message[:from].addrs.first.display_name
    end

    it "makes replies go to the original sender" do
      forward(["staff@example.com"])

      message = Mail.read_from_string(sent(:send_raw_email).first[:raw_message][:data])
      assert_equal ["alice@gmail.com"], message.reply_to
    end

    it "rewrites the headers so SES can send it as itself" do
      forward(["staff@example.com"], message_id: "ses-message-1")

      message = Mail.read_from_string(sent(:send_raw_email).first[:raw_message][:data])
      # (setting Return-Path adds a header rather than replacing the original one, so both are present)
      assert_includes message.header.fields.select { |field| field.name == "Return-Path" }.map(&:to_s),
                      "bounces@#{mailer_host}"
      assert_equal "default", message.header["X-SES-CONFIGURATION-SET"].to_s
      assert_equal "ses-message-1", message.header["X-Intercode-Message-ID"].to_s
      assert_nil message.header["DKIM-Signature"]
      assert_nil message.header["Sender"]
      assert_includes message.header["X-Intercode-Original-Return-Path"].to_s, "alice@gmail.com"
      assert_includes message.header["X-Intercode-Original-Sender"].to_s, "bounce-handler@gmail.com"
    end

    it "doesn't touch the message it was given" do
      original = Mail.read_from_string(raw_email)

      forward(["staff@example.com"], email: original)

      assert_equal ["staff@example.com"], original.to
      assert_equal ["alice@gmail.com"], original.from
    end

    it "accepts the email as a Mail::Message as well as a string" do
      forward(["staff@example.com"], email: Mail.read_from_string(raw_email))

      assert_equal 1, sent(:send_raw_email).size
    end

    it "accepts Mail::Address recipients as well as strings" do
      forward([Mail::Address.new("staff@example.com")])

      assert_equal 1, sent(:send_raw_email).size
    end
  end

  describe "an address with no route" do
    it "bounces mail to an address on one of our domains" do
      forward(["nobody@example.com"], message_id: "ses-message-2")

      assert_empty sent(:send_raw_email)
      bounce = sent(:send_bounce).first
      assert_equal "ses-message-2", bounce[:original_message_id]
      assert_equal [{ recipient: "nobody@example.com", bounce_type: "DoesNotExist" }],
                   bounce[:bounced_recipient_info_list]
      assert_equal "Mail Delivery Subsystem <noreply@#{mailer_host}>", bounce[:bounce_sender]
    end

    it "bounces mail to our event mailing list domain too" do
      convention.update!(event_mailing_list_domain: "events.example.com")

      forward(["nobody@events.example.com"])

      assert_equal 1, sent(:send_bounce).size
    end

    it "bounces mail to a domain that only has email routes" do
      EmailRoute.create!(receiver_address: "someone@routes.example.org", forward_addresses: ["x@gmail.com"])

      forward(["nobody@routes.example.org"])

      assert_equal 1, sent(:send_bounce).size
    end

    it "ignores mail to a domain that isn't ours, without bouncing it" do
      forward(["someone@elsewhere.example.net"])

      assert_empty sent(:send_raw_email)
      assert_empty sent(:send_bounce)
    end
  end

  describe "an email route" do
    it "forwards to the route's forward addresses" do
      EmailRoute.create!(receiver_address: "route@example.com", forward_addresses: %w[x@gmail.com y@gmail.com])

      forward(["route@example.com"])

      message = Mail.read_from_string(sent(:send_raw_email).first[:raw_message][:data])
      assert_equal %w[x@gmail.com y@gmail.com], message.to.sort
    end
  end

  describe "several recipients" do
    it "handles each one: forwarding some, bouncing others, ignoring the rest" do
      staff_position_with_members
      create(:convention, domain: "other.example.org")

      forward(%w[staff@example.com nobody@example.com someone@elsewhere.example.net])

      assert_equal 1, sent(:send_raw_email).size
      assert_equal(
        ["nobody@example.com"],
        sent(:send_bounce).flat_map { |b| b[:bounced_recipient_info_list].pluck(:recipient) }
      )
    end
  end

  describe "when SES refuses the message" do
    setup { staff_position_with_members }

    it "bounces it as too large if SES says the message is too long" do
      ses_client.stub_responses(
        :send_raw_email,
        Aws::SES::Errors::InvalidParameterValue.new(nil, "Message length is more than the allowed 10485760 bytes")
      )

      forward(["staff@example.com"])

      assert_equal(
        [{ recipient: "staff@example.com", bounce_type: "MessageTooLarge" }],
        sent(:send_bounce).first[:bounced_recipient_info_list]
      )
    end

    it "bounces it as a nonexistent address for any other invalid parameter" do
      ses_client.stub_responses(:send_raw_email, Aws::SES::Errors::InvalidParameterValue.new(nil, "Something else"))

      forward(["staff@example.com"])

      assert_equal(
        [{ recipient: "staff@example.com", bounce_type: "DoesNotExist" }],
        sent(:send_bounce).first[:bounced_recipient_info_list]
      )
    end
  end

  describe "a message with no usable From address" do
    setup { staff_position_with_members }

    it "drops it rather than forwarding it" do
      forward(["staff@example.com"], email: raw_email(from: "undisclosed-recipients:;"))

      assert_empty sent(:send_raw_email)
      assert_empty sent(:send_bounce)
    end
  end
end
