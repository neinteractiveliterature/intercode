# An organization that runs conventions
class OrganizationDrop < Liquid::Drop
  # @api
  attr_reader :organization

  # @!method name
  #   @return [String] The name of the organization
  # @!method conventions
  #   @return [Array<ConventionDrop>] All the conventions run by this organization
  delegate :name, :conventions, to: :organization

  # @api
  def initialize(organization)
    @organization = organization
  end
end
