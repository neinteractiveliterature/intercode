class RemoveNewsAndConComMeetingsFromConventions < ActiveRecord::Migration[5.1]
  def change
    remove_column :conventions, :news, :text
    remove_column :conventions, :con_com_meetings, :text
  end
end
