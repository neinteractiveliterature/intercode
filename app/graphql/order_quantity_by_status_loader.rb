class OrderQuantityByStatusLoader < GraphQL::Batch::Loader
  def initialize(model)
    @model = model

    return if [Product, ProductVariant].include?(model)
    raise 'model must be either Product or ProductVariant'
  end

  def perform(records)
    records_by_id = records.index_by(&:id)

    results_by_record_and_status = {}

    query_scope(records_by_id.keys).sum(:quantity).each do |(id, status), quantity|
      result = { status: status, quantity: quantity }
      record = records_by_id[id]
      results_by_record_and_status[record] ||= empty_results_by_status
      results_by_record_and_status[record][status] = result
    end

    records.each do |record|
      results = results_by_record_and_status[record]
      if results
        fulfill(record, results.values)
      else
        fulfill(record, empty_results_by_status.values)
      end
    end
  end

  private

  def query_scope(record_ids)
    scope = OrderEntry.joins(:order).where.not(orders: { status: 'pending' })
    if @model == Product
      scope.where(product_variant_id: nil, product_id: record_ids)
        .group(:product_id, 'orders.status')
    else
      scope.where(product_variant_id: record_ids)
        .group(:product_variant_id, 'orders.status')
    end
  end

  def empty_results_by_status
    (Types::OrderStatusType.values.keys - ['pending'])
      .map { |status| { status: status, quantity: 0 } }
      .index_by { |result| result[:status] }
  end
end
