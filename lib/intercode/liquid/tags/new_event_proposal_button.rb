module Intercode
  module Liquid
    module Tags
      class NewEventProposalButton < RailsPartialRenderer
        attr_reader :button_text, :button_class

        def initialize(tag_name, args, _options)
           super

           if args && args =~ /\"([^\"]+)\"(\s+(\w.*))?/
             @button_text = $1
             @button_class = $3
           end
        end

        def partial(_context)
          "event_proposals/new_event_proposal_button"
        end

        def locals(_context)
          {
            button_text: button_text,
            button_class: button_class,
          }
        end
      end
    end
  end
end

Liquid::Template.register_tag('new_event_proposal_button', Intercode::Liquid::Tags::NewEventProposalButton)
