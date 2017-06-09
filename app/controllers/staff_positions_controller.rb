class StaffPositionsController < BaseControllers::VirtualHost
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
    if @staff_position.save
      redirect_to action: 'index', notice: 'Staff position was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /staff_positions/1
  def update
    if @staff_position.update(staff_position_params)
      redirect_to action: 'index', notice: 'Staff position was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /staff_positions/1
  def destroy
    @staff_position.destroy
    redirect_to action: 'index', notice: 'Staff position was successfully destroyed.'
  end

  private

  def staff_position_params
    params.require(:staff_position).permit(:name, :email)
  end
end
