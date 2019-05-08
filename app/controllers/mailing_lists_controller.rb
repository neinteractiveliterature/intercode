class MailingListsController < ApplicationController
  def index
    authorize! :mail_to_any, convention
  end
end
