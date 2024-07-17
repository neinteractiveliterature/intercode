# frozen_string_literal: true
class Types::SignupMoveResultType < Types::BaseObject
  field :bucket_key, String, null: true
  field :prev_bucket_key, String, null: true
  field :prev_state, Types::SignupStateType, null: false
  field :signup, Types::SignupType, null: false
  field :signup_id, Int, null: false
  field :state, Types::SignupStateType, null: false

  def signup
    dataloader.with(Sources::ModelById, Signup).load(object.signup_id)
  end
end
