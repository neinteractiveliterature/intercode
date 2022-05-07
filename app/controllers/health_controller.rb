class HealthController < ApplicationController
  def healthz
    head :ok
  end
end
