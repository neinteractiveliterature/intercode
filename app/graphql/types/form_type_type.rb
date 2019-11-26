class Types::FormTypeType < Types::BaseEnum
  Form::FORM_TYPE_CONFIG.each do |key, config|
    value key, config['description'].capitalize
  end
end
