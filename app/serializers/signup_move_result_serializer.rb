class SignupMoveResultSerializer < ActiveJob::Serializers::ObjectSerializer
  def serialize(signup_move_result)
    super(signup_move_result.to_h)
  end

  def deserialize(hash)
    hash = hash.with_indifferent_access
    SignupMoveResult.new(
      hash[:signup_id],
      hash[:state],
      hash[:bucket_id],
      hash[:prev_state],
      hash[:prev_bucket_id],
      bucket_name: hash[:bucket_name],
      prev_bucket_name: hash[:prev_bucket_name]
    )
  end

  private

  def klass
    SignupMoveResultSerializer
  end
end
