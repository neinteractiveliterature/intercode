class StaffPositionsController < BaseControllers::VirtualHost
  self.responder = NoShowActionResponder

  load_and_authorize_resource through: :convention
  respond_to :html, :json

  # GET /staff_positions
  def index
  end

  # GET /staff_positions/new
  def new
  end

  # GET /staff_positions/1/edit
  def edit
  end

  # POST /staff_positions
  def create
    @staff_position.save
    respond_with @staff_position
  end

  # PATCH/PUT /staff_positions/1
  def update
    @staff_position.update(staff_position_params)
    respond_with @staff_position
  end

  # DELETE /staff_positions/1
  def destroy
    @staff_position.destroy
    respond_with @staff_position
  end

  private

  def staff_position_params
    params.require(:staff_position).permit(:name, :email, user_con_profile_ids: [])
  end
end
