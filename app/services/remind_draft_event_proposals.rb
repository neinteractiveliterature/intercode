# frozen_string_literal: true
class RemindDraftEventProposals < CivilService::Service
  private

  def inner_call
    drafts_to_remind.each do |proposal|
      EventProposals::UnfinishedDraftReminderNotifier.new(event_proposal: proposal).deliver_later
      proposal.update_columns(reminded_at: Time.zone.now) # avoid bumping updated_at
    end

    success
  end

  def drafts_to_remind
    @drafts_to_remind ||=
      begin
        old_drafts =
          EventProposal
            .draft
            .not_reminded
            .joins(:convention)
            .where('event_proposals.created_at < ?', 1.week.ago)
            .where('conventions.starts_at > ?', Time.zone.now)
            .includes(event_category: { event_proposal_form: :form_items })

        old_drafts.select { |proposal| completion_fraction(proposal) > 0.25 }
      end
  end

  def completion_fraction(proposal)
    form = proposal.event_category.event_proposal_form
    responses = proposal.read_form_response_attributes_for_form_items(form.form_items)
    responses.values.count(&:present?).to_f / responses.size
  end
end
