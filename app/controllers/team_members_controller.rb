class TeamMembersController < ApplicationController
  # TODO: Verify that the user is logged in.  For now we're
  # skipping authorization.
  skip_after_filter :ensure_authorization_performed

  def new
    @team_member = TeamMember.new
    @team_member.display = true
    populate_event_fields(params[:event])
  end

  def create
    puts "In create - params"
    puts params
    m = params[:team_member]

# Uncomment to create a bug so processing will stop and we'll see the
# request info
#    populate_event_fields(m[event_id])

    @team_member = TeamMember.new(member_params)

    puts "In create after new - params"
    puts params

    puts "In create - new team_member.display"
    puts @team_member.display

    @team_member.updated_by_id = current_user.id

    if @team_member.save
      redirect_to(team_members_path({event: m[:event_id]}))
    else
      populate_event_fields(m[:event_id])
      render 'new'
    end
  end

  def edit
    @team_member = TeamMember.find(params[:id])
  end

  def update
    @team_member = TeamMember.find(params[:id])

    @team_member.updated_by_id = current_user.id

    if @team_member.update_attributes(member_params)
#      redirect_to action: 'index'
#      redirect_to(team_members_path({event: params[:id],
#	                             title: params[:title],
#                                     appellation: params[:appellation]
#                                     id: 1}))
      redirect_to(team_member_path({event: params[:id],
	                             title: params[:title],
                                     appellation: params[:appellation],
                                     id: 1}))
    else
      render 'update'
    end
  end

  def index
    @team = TeamMember.joins(:user)
                      .where('event_id=?', params[:event])
                      .select('team_members.*, users.first_name, users.last_name')
                      .order('last_name ASC, first_name ASC')
    populate_event_fields(params[:event])
  end

  def show
  end

  def destroy
  end

  # Permit access to fields that can be updated
  def member_params
    puts"In member_params"
    params.require(:team_member).permit(:event_id,
                                        :user_id,
                                        :display,
                                        :show_email,
                                        :receive_con_email,
                                        :receive_signup_email)
  end

  def populate_event_fields(id)
    e = Event.find(id)
    if 'Events::Larp' == e[:type]
      @singular = 'GM'
      @plural = 'GMs'
    else
      @singluar = 'Unknown'
      @plural = 'Unknown'
    end
    @title = e[:title]
  end
end
