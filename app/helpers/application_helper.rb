module ApplicationHelper
  DEFAULT_NAVBAR_CLASSES = 'navbar-fixed-top navbar-expand-md mb-4 navbar-dark bg-intercode-blue'

  def self.obfuscated_email(address)
    address.gsub('.', ' DOT ').gsub('@', ' AT ')
  end

  def react_navigation_bar(cms_layout = nil)
    context = {
      assumed_identity_from_profile: assumed_identity_from_profile,
      current_user: current_user,
      current_ability: current_ability,
      user_con_profile: user_con_profile,
      convention: convention,
      cadmus_renderer: cadmus_renderer,
      current_pending_order: current_pending_order
    }

    result = IntercodeSchema.execute(
      navigation_bar_query,
      variables: { cms_layout_id: cms_layout&.id },
      context: context
    )

    raise result['errors'].to_json if result['errors'].present?

    app_component 'NavigationBar',
      navigationBar: result['data']['navigationBar'],
      assumedIdentityFromProfile: result['data']['assumedIdentityFromProfile'],
      myProfile: result['data']['myProfile'],
      convention: result['data']['convention'],
      currentUser: result['data']['currentUser'],
      currentPendingOrder: result['data']['currentPendingOrder']
  end

  def navigation_bar_query
    <<~GRAPHQL
    fragment NavigationItemFields on NavigationItem {
      label
      url
      visible
      http_method
    }

    query($cms_layout_id: Int) {
      convention {
        ticket_name
        ticket_types {
          publicly_available
        }
      }

      assumedIdentityFromProfile {
        name_without_nickname
      }

      currentUser {
        id
      }

      currentPendingOrder {
        order_entries {
          quantity
        }
      }

      myProfile {
        name
        name_without_nickname
        first_name
        last_name
        ticket {
          id
        }
      }

      navigationBar(cms_layout_id: $cms_layout_id) {
        classes
        items {
          __typename

          ...on NavigationBrand {
            label
          }

          ...on NavigationCollapse {
            groups {
              expand
              items {
                __typename

                ...on NavigationItem {
                  ...NavigationItemFields
                }

                ...on UserNavigationSection {
                  items {
                    ...NavigationItemFields
                  }
                }

                ...on NavigationSection {
                  label
                  items {
                    ...NavigationItemFields
                  }
                }
              }
            }
          }
        }
      }
    }
    GRAPHQL
  end

  def page_title
    parts = []

    parts << @page_title if @page_title.present?
    parts << @event.title if @event

    if @convention
      parts << @convention.name
    else
      parts << 'Intercode'
    end

    parts.join(' - ')
  end

  # Generate an obfuscated email address if the user is not logged in.
  # Note that we may not need this.  Rails has other mechanisms to
  # prevent the harvesting of email addresses. But this way all of the
  # code to generate mailto links will be gathered in one place so we
  # can easily modify them.
  def intercode_mail_to(address, name = nil, html_options = {})
    # If the address is empty, just return the empty string
    return unless address.present?

    # If the user is logged in, return a mailto link.  Otherwise,
    # return an obfuscated version of the address
    if user_signed_in?
      mail_to(address, name, html_options)
    else
      ApplicationHelper.obfuscated_email(address)
    end
  end

  def app_component(name, props = {})
    react_component(name, props.merge(app_component_props))
  end
end
