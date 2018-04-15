module Concerns::SignupsGrid
  extend ActiveSupport::Concern

  included do
    scope do
      Signup.includes(:user_con_profile, run: :event)
    end
  end

  class_methods do
    def bucket_column
      column(:bucket, order: 'signups.bucket_key') do |signup|
        if signup.counted?
          bucket_name = signup.bucket.try!(:name)
          requested_bucket_name = signup.requested_bucket.try!(:name)

          if bucket_name == requested_bucket_name
            bucket_name
          elsif requested_bucket_name
            "#{bucket_name || 'None'} (requested #{requested_bucket_name})"
          elsif bucket_name
            "#{bucket_name} (no preference)"
          end
        else
          if signup.bucket
            "#{signup.bucket.name} (not counted)"
          else
            'Not counted'
          end
        end
      end
    end
  end
end
