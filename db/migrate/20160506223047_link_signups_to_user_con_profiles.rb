class LinkSignupsToUserConProfiles < ActiveRecord::Migration
  class Signup < ActiveRecord::Base
    belongs_to :user_con_profile, class_name: "LinkSignupsToUserConProfiles::UserConProfile"
    belongs_to :user, class_name: "LinkSignupsToUserConProfiles::User"
    belongs_to :run, class_name: "LinkSignupsToUserConProfiles::Run"
  end

  class Run < ActiveRecord::Base
    belongs_to :event, class_name: "LinkSignupsToUserConProfiles::Event"
  end

  class Event < ActiveRecord::Base
    belongs_to :convention, class_name: "LinkSignupsToUserConProfiles::Convention"
  end

  class Convention < ActiveRecord::Base
    has_many :user_con_profiles, class_name: "LinkSignupsToUserConProfiles::UserConProfile"
  end

  class User < ActiveRecord::Base
  end

  class UserConProfile < ActiveRecord::Base
  end

  def up
    add_reference :signups, :user_con_profile, index: true, foreign_key: true

    LinkSignupsToUserConProfiles::Signup.includes(:run => { :event => :convention }).find_each do |signup|
      signup.update!(user_con_profile: signup.run.event.convention.user_con_profiles.find_by!(user_id: signup.user_id))
    end

    remove_reference :signups, :user
    change_column :signups, :user_con_profile_id, :integer, null: false
  end
end