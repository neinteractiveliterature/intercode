class Types::SortInputType < Types::BaseInputObject

  argument :field, String, required: true
  argument :desc, Boolean, required: true
end
