# frozen_string_literal: true

Rails.application.config.session_store :active_record_store, key: "_intercode_session_v2", expire_after: 2.weeks
