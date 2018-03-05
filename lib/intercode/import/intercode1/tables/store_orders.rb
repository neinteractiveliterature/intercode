class Intercode::Import::Intercode1::Tables::StoreOrders < Intercode::Import::Intercode1::Table
  attr_reader :con, :user_con_profiles_id_map

  def initialize(connection, con, user_con_profiles_id_map)
    super connection
    @con = con
    @user_con_profiles_id_map = user_con_profiles_id_map
  end

  private

  def build_record(row)
    user_con_profiles_id_map[row[:UserId]].orders.new(
      status: row[:Status].downcase,
      payment_amount_cents: row[:PaymentCents],
      payment_amount_currency: 'USD',
      payment_note: row[:PaymentNote]
    )
  end

  def row_id(row)
    row[:OrderId]
  end
end
