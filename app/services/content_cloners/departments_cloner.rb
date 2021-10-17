# frozen_string_literal: true
class ContentCloners::DepartmentsCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    @id_maps[:departments] = clone_with_id_map(source_convention.departments, convention.departments)
  end
end
