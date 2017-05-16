class CmsFilesController < BaseControllers::VirtualHost
  load_and_authorize_resource through: :convention

  # GET /cms_files
  def index
    @cms_files = CmsFile.all
  end

  # GET /cms_files/1
  def show
  end

  # GET /cms_files/new
  def new
    @cms_file = CmsFile.new
  end

  # GET /cms_files/1/edit
  def edit
  end

  # POST /cms_files
  def create
    @cms_file = CmsFile.new(cms_file_params)

    if @cms_file.save
      redirect_to @cms_file, notice: 'Cms file was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /cms_files/1
  def update
    if @cms_file.update(cms_file_params)
      redirect_to @cms_file, notice: 'Cms file was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /cms_files/1
  def destroy
    @cms_file.destroy
    redirect_to cms_files_url, notice: 'Cms file was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cms_file
      @cms_file = CmsFile.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def cms_file_params
      params.fetch(:cms_file, {})
    end
end
