class FormApiJSONLoader < GraphQL::Batch::Loader
  attr_reader :cadmus_renderer

  def initialize(cadmus_renderer)
    @cadmus_renderer = cadmus_renderer
  end

  def perform(keys)
    %i[form_sections form_items].each do |association_name|
      ::ActiveRecord::Associations::Preloader.new.preload(keys, association_name)
    end

    keys.each do |form|
      fulfill(form, FormApiPresenter.new(form, cadmus_renderer).as_json)
    end
  end
end
