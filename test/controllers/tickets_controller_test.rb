require 'test_helper'

class TicketsControllerTest < ActionController::TestCase
  let(:convention) { FactoryBot.create(:convention) }
  let(:user_con_profile) { FactoryBot.create(:user_con_profile, convention: convention) }
  let(:ticket_type) { FactoryBot.create(:paid_ticket_type, convention: convention) }

  before do
    convention
    set_convention convention

    ticket_type
    sign_in user_con_profile.user
  end

  describe '#new' do
    it 'redirects you if you already have a ticket' do
      FactoryBot.create(:ticket, ticket_type: ticket_type, user_con_profile: user_con_profile)
      get :new

      assert_redirected_to ticket_path
    end

    it 'redirects you if there is only one ticket type available' do
      get :new
      assert_redirected_to new_ticket_path(ticket: { ticket_type_id: ticket_type.id })
    end

    it 'does not redirect you if you have selected a ticket type' do
      get :new, params: { ticket: { ticket_type_id: ticket_type.id } }

      assert_template 'new'
    end

    it 'does not redirect you if there is more than one ticket type available' do
      FactoryBot.create(:paid_ticket_type, convention: convention)
      get :new

      assert_template 'new'
    end

    it 'will not let you in if the con is sold out' do
      convention.update!(maximum_tickets: 1)
      lucky_winner = FactoryBot.create(:user_con_profile, convention: convention)
      FactoryBot.create(:ticket, ticket_type: ticket_type, user_con_profile: lucky_winner)
      get :new

      assert_redirected_to root_path
      assert_match /sold out/, flash[:alert]
    end

    it 'will not let you purchase an unavailable ticket type' do
      unavailable_ticket_type = FactoryBot.create(:paid_ticket_type, convention: convention, name: 'unavailable', publicly_available: false)
      get :new, params: { ticket: { ticket_type_id: unavailable_ticket_type } }

      assert_redirected_to new_ticket_path
      assert_match /not publicly available/, flash[:alert]
    end
  end

  describe '#create' do
    let(:stripe_helper) { StripeMock.create_test_helper }
    before { StripeMock.start }
    after { StripeMock.stop }

    it 'buys a ticket' do
      assert_difference('Ticket.count', 1) do
        post :create, params: {
          ticket: { ticket_type_id: ticket_type.id },
          stripeToken: stripe_helper.generate_card_token,
          format: 'json'
        }
      end

      assert_response :success
    end

    it 'renders an error if there is a charge issue' do
      StripeMock.prepare_card_error(:card_declined)
      post :create, params: {
        ticket: { ticket_type_id: ticket_type.id },
        stripeToken: stripe_helper.generate_card_token,
        format: 'json'
      }

      assert_response :unprocessable_entity
      assert_match /declined/, JSON.parse(response.body)['errors']['base'].join(', ')
    end

    it 'redirects you if you already have a ticket' do
      FactoryBot.create(:ticket, ticket_type: ticket_type, user_con_profile: user_con_profile)
      post :create, params: { ticket: { ticket_type_id: ticket_type.id } }

      assert_redirected_to ticket_path
    end

    it 'will not let you in if the con is sold out' do
      convention.update!(maximum_tickets: 1)
      lucky_winner = FactoryBot.create(:user_con_profile, convention: convention)
      FactoryBot.create(:ticket, ticket_type: ticket_type, user_con_profile: lucky_winner)
      post :create, params: { ticket: { ticket_type_id: ticket_type.id } }

      assert_redirected_to root_path
      assert_match /sold out/, flash[:alert]
    end

    it 'will not let you purchase an unavailable ticket type' do
      unavailable_ticket_type = FactoryBot.create(:paid_ticket_type, convention: convention, name: 'unavailable', publicly_available: false)
      post :create, params: { ticket: { ticket_type_id: unavailable_ticket_type } }

      assert_redirected_to new_ticket_path
      assert_match /not publicly available/, flash[:alert]
    end
  end
end
