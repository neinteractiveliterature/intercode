require "fly.io-rails/machines"

class HostingServiceAdapters::Fly < HostingServiceAdapters::Base
  def applicable?
    ENV["FLY_APP_NAME"].present? && ENV["FLY_API_TOKEN"].present?
  end

  def fetch_instance_count
    web_machines.count
  end

  def update_instance_count(instance_count)
    raise "Instance count must be at least 1" if instance_count < 1

    if instance_count > fetch_instance_count
      scale_up(instance_count - fetch_instance_count)
    elsif instance_count < fetch_instance_count
      scale_down(fetch_instance_count - instance_count)
    end
  end

  private

  def scale_up(amount)
    config = web_machines.first[:config]
    created_machines =
      Array
        .new(amount)
        .map do
          Fly::Machines.create_and_start_machine(
            ENV.fetch("FLY_APP_NAME"),
            { config: config, region: web_machines.first[:region] }
          )
        end
    Rails.logger.info "Created and started Fly machines: #{created_machines.pluck(:name).join(", ")}"
    Rails.logger.info "Waiting for all machines to start"
    created_machines.each do |machine|
      Fly::Machines.wait_for_machine(ENV.fetch("FLY_APP_NAME"), machine[:id], status: "started")
    end
    created_machines
  end

  def scale_down(amount)
    to_destroy = web_machines.first(amount)
    to_stop = to_destroy.filter { |machine| machine[:state] != "stopped" }
    to_stop.each do |machine|
      Rails.logger.info "Stopping Fly machine #{machine[:name]}"
      Fly::Machines.stop_machine(ENV.fetch("FLY_APP_NAME"), machine[:id])
    end
    unless to_stop.empty?
      Rails.logger.info "Waiting for all machines to stop"
      to_stop.each do |machine|
        Fly::Machines.wait_for_machine(ENV.fetch("FLY_APP_NAME"), machine[:id], status: "stopped")
      end
    end

    to_destroy.each do |machine|
      Rails.logger.info "Deleting Fly machine #{machine[:name]}"
      Fly::Machines.delete_machine(ENV.fetch("FLY_APP_NAME"), machine[:id])
    end

    to_destroy
  end

  def web_machines
    @web_machines ||=
      begin
        Fly::Machines.fly_api_hostname!
        Fly::Machines
          .list_machines(ENV.fetch("FLY_APP_NAME"), nil)
          .filter { |machine| machine[:config][:metadata][:fly_process_group] == "web" }
      end
  end
end
