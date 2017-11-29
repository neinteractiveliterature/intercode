class Intercode::Import::Intercode1::UserConProfileForm
  attr_reader :convention, :form_importer

  def initialize(convention)
    @convention = convention
    @form_importer = Intercode::Import::Intercode1::FormImporter.new(
      File.expand_path('../user_con_profile_form.json', __FILE__)
    )
  end

  def import!
    logger.info "Importing user con profile form"

    form = convention.create_user_con_profile_form!(title: "User con profile form", convention: convention)
    convention.save!

    form_importer.import(form)
  end

  private

  def logger
    Intercode::Import::Intercode1.logger
  end
end
