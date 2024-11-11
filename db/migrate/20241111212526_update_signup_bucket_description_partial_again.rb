class UpdateSignupBucketDescriptionPartialAgain < ActiveRecord::Migration[7.2]
  PREVIOUS_SIGNUP_BUCKET_DESCRIPTION = <<~LIQUID
  {%- if signup.state != 'confirmed' %} [{{ signup.state | capitalize }}]{% endif -%}
  {%- if signup.team_member? %} [{{ signup.event.team_member_name }}]
  {%- elsif signup.bucket.name -%}
    {%- if signup.bucket.name != 'Signups' -%}
      {%- if signup.bucket.name != 'Interested' %} [{{ signup.bucket.name }}
        {%- if signup.bucket.name != signup.requested_bucket.name %} (requested {{ signup.requested_bucket.name}}){% endif -%}
      ]
      {%- endif -%}
    {%- endif -%}
  {%- endif -%}
  LIQUID

  PREVIOUS_CONTENT = {
    "partials" => {
      "standard" => {
        "signup_bucket_description" => {
          "content" => PREVIOUS_SIGNUP_BUCKET_DESCRIPTION
        }
      }
    }
  }

  def up
    standard = CmsContentSet.new(name: "standard")

    Convention.find_each do |convention|
      content_set = standard
      cms_partial_identifiers = %w[signup_bucket_description]

      partial_conflict_policy =
        CmsContentLoaders::ConflictPolicies::Update.new(PREVIOUS_CONTENT.fetch("partials").fetch(content_set.name))
      partial_loader =
        CmsContentLoaders::CmsPartials.new(
          cms_parent: convention,
          content_set:,
          content_identifiers: cms_partial_identifiers,
          conflict_policy: partial_conflict_policy
        )
      partial_loader.call!
      partial_conflict_policy.skipped_items.each { |skipped_item| say "#{convention.name}: #{skipped_item.message}" }
    end
  end

  def down
  end
end
