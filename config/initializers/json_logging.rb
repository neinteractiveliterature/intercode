if ENV["JSON_LOGGING"]
  Rails.application.configure do
    config.lograge.formatter = Lograge::Formatters::Json.new
    config.lograge.enabled = true
    config.lograge.base_controller_class = ["ActionController::Base"]

    config.lograge.custom_options =
      lambda do |event|
        custom_options = {
          request_time: Time.now,
          application: Rails.application.class.name.delete_suffix("::Application"),
          process_id: Process.pid,
          host: event.payload[:host],
          remote_ip: event.payload[:remote_ip],
          user_agent: event.payload[:user_agent],
          ip: event.payload[:ip],
          x_forwarded_for: event.payload[:x_forwarded_for],
          params: event.payload[:params],
          rails_env: Rails.env,
          exception: event.payload[:exception]&.first,
          request_id: event.payload[:headers]["action_dispatch.request_id"],
          current_user_id: event.payload[:current_user_id],
          assumed_identity_from_profile_id: event.payload[:assumed_identity_from_profile_id]
        }.compact

        custom_options[:gc_stat] = GC.stat if ENV["GC_DEBUG"]

        custom_options
      end
  end
end
