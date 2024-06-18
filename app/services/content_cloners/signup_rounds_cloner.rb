# frozen_string_literal: true
class ContentCloners::SignupRoundsCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    time_distance = convention.starts_at - source_convention.starts_at

    @id_maps[:signup_rounds] = clone_with_id_map(
      source_convention.signup_rounds,
      convention.signup_rounds
    ) do |_source_round, round|
      round.executed_at = nil
      round.start += time_distance if round.start
    end
  end
end
