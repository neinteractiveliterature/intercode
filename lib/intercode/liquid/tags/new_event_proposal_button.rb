module Intercode
  module Liquid
    module Tags
      # Renders a "Propose an event" button.  This will automatically render as a
      # "Log in to propose" button if the user is not logged in.  The button text and the button
      # CSS classes can be customized.
      #
      # @liquid_tag_name new_event_proposal_button
      # @example Customizing the button text
      #   {% new_event_proposal_button "Propose, right now!" %}
      # @example Customizing the button text and the CSS class
      #   {% new_event_proposal_button "Propose, or don't" btn-warning %}
      class NewEventProposalButton < AppComponentRenderer
        attr_reader :button_text, :button_class

        def initialize(tag_name, args, _options)
          super
          return unless args && args =~ /\"([^\"]+)\"(\s+(\w.*))?/

          @button_text = Regexp.last_match(1)
          @button_class = Regexp.last_match(3)
        end

        def component_name(_context)
          'ProposeEventButton'
        end

        def props(_context)
          {
            caption: button_text.presence || 'Propose an event',
            className: button_class.presence || 'btn btn-secondary'
          }
        end
      end
    end
  end
end

Liquid::Template.register_tag(
  'new_event_proposal_button',
  Intercode::Liquid::Tags::NewEventProposalButton
)
