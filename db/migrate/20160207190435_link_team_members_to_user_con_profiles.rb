class LinkTeamMembersToUserConProfiles < ActiveRecord::Migration
  class TeamMember < ActiveRecord::Base
    belongs_to :user_con_profile, class_name: "LinkTeamMembersToUserConProfiles::UserConProfile"
    belongs_to :user, class_name: "LinkTeamMembersToUserConProfiles::User"
    belongs_to :event, class_name: "LinkTeamMembersToUserConProfiles::Event"
  end

  class Event < ActiveRecord::Base
    belongs_to :convention, class_name: "LinkTeamMembersToUserConProfiles::Convention"
  end

  class Convention < ActiveRecord::Base
    has_many :user_con_profiles, class_name: "LinkTeamMembersToUserConProfiles::UserConProfile"
  end

  class User < ActiveRecord::Base
  end

  class UserConProfile < ActiveRecord::Base
  end

  def up
    add_reference :team_members, :user_con_profile, index: true, foreign_key: true

    LinkTeamMembersToUserConProfiles::TeamMember.includes(:event => :convention).find_each do |team_member|
      team_member.update!(user_con_profile: team_member.event.convention.user_con_profiles.find_by!(user_id: team_member.user_id))
    end

    remove_reference :team_members, :user
    change_column :team_members, :user_con_profile_id, :integer, null: false
  end
end
