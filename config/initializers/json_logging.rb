if ENV["JSON_LOGGING"]
  Rails.application.configure do
    config.lograge.formatter = Lograge::Formatters::Json.new
    config.lograge.enabled = true
    config.lograge.base_controller_class = ["ActionController::Base"]
    config.lograge.custom_payload do |controller|
      {
        host: controller.request.host,
        current_user_id: controller.current_user&.id,
        assumed_identity_from_profile_id:
          controller.respond_to?(:assumed_identity_from_profile) ? controller.assumed_identity_from_profile&.id : nil,
        remote_ip: controller.request.remote_ip,
        ip: controller.request.ip,
        x_forwarded_for: controller.request.headers["X-Forwarded-For"],
        user_agent: controller.request.headers["User-Agent"]
      }
    end

    config.lograge.custom_options =
      lambda do |event|
        gc_stat = GC.stat
        {
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
          assumed_identity_from_profile_id: event.payload[:assumed_identity_from_profile_id],
          dyno_type: dyno_type,
          dyno_id: dyno_id,
          gc: gc_stat
        }.compact
      end
  end
end
