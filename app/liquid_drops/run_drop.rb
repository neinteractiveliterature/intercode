class RunDrop < Liquid::Drop
  attr_reader :run
  delegate :event, :starts_at, :ends_at, :length_seconds, to: :run

  def initialize(run)
    @run = run
  end
end