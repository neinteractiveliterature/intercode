# frozen_string_literal: true
class ContentCloners::StaffPositionsCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    @id_maps[:staff_positions] = clone_with_id_map(
      source_convention.staff_positions,
      convention.staff_positions
    ) do |staff_position, cloned_staff_position|
      cloned_staff_position.email = replace_convention_domain(staff_position.email, convention)
      cloned_staff_position.save!

      staff_position.permissions.each do |permission|
        cloned_staff_position.permissions.create!(
          model: @id_maps.fetch(permission.model.class.table_name.to_sym)[permission.model.id],
          permission: permission.permission
        )
      end
    end

    return unless source_convention.catch_all_staff_position
    convention.update!(
      catch_all_staff_position: @id_maps[:staff_positions][source_convention.catch_all_staff_position_id]
    )
  end

  private

  def replace_convention_domain(string, convention)
    return nil unless string
    string.gsub(/#{Regexp.escape source_convention.domain}/, convention.domain)
  end
end
