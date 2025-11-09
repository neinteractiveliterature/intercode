class SignupMoveResultSerializer < ActiveJob::Serializers::ObjectSerializer
  def serialize(signup_move_result)
    super(signup_move_result.to_h)
  end

  def deserialize(hash)
    hash = hash.with_indifferent_access
    SignupMoveResult.new(hash[:signup_id], hash[:state], hash[:bucket_key], hash[:prev_state], hash[:prev_bucket_key])
  end

  private

  def klass
    SignupMoveResultSerializer
  end
end
