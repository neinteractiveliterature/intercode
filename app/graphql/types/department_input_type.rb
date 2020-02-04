class Types::DepartmentInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :proposal_description, String, required: false, camelize: false
end
