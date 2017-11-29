class MyProfilesController < ApplicationController
  include Concerns::FormResponseController

  before_action :ensure_user_con_profile, except: [:new]
  before_action :build_user_con_profile, only: [:new]
  authorize_resource :user_con_profile

  respond_to :html, except: [:update]
  respond_to :json, only: [:show, :update]

  def show
    send_form_response(convention.user_con_profile_form, @user_con_profile)
  end

  def edit
  end

  def edit_bio
  end

  def update
    update_form_response(@user_con_profile)
  end

  def new
    @user_con_profile.save!
    redirect_to edit_my_profile_path
  end

  private
  def ensure_user_con_profile
    unless user_con_profile
      if user_signed_in?
        respond_to do |format|
          format.html { redirect_to new_my_profile_path }
        end
      else
        session[:register_via_convention_id] = convention.id
        redirect_to new_user_registration_url(host: Rails.application.config.action_mailer.default_url_options[:host])
      end
    end
  end

  def build_user_con_profile
    user_params = {
      'first_name' => current_user.first_name,
      'last_name' => current_user.last_name
    }
    @user_con_profile = current_user.user_con_profiles.build(
      user_params.merge(convention_id: convention.id)
    )
    @user_con_profile.assign_default_values_from_form_items(convention.user_con_profile_form.form_items)

    most_recent_profile = current_user.user_con_profiles.order(:created_at).last
    if most_recent_profile
      @user_con_profile.assign_form_response_attributes(
        FormResponsePresenter.new(convention.user_con_profile_form, most_recent_profile).as_json
      )
    end
  end
end
