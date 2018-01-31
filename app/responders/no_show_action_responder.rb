# A responder for controllers without a "show" action; successful creates and edits will redirect
# back to index instead.
class NoShowActionResponder < ActionController::Responder
  protected

  # Overwrite navigation_behavior to redirect to the collection_location.
  def navigation_location
    return options[:location] if options[:location]
    klass = resources.last.class

    if klass.respond_to?(:model_name)
      resources[0...-1] << klass.model_name.plural.to_sym
    else
      resources
    end
  end
end
