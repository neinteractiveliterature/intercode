# frozen_string_literal: true
class SignupRankedChoiceDrop < Liquid::Drop
  delegate :target_run, to: :signup_ranked_choice

  def initialize(signup_ranked_choice)
    @signup_ranked_choice = signup_ranked_choice
  end

  private

  attr_reader :signup_ranked_choice
end
