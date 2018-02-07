module Concerns::SortBuckets
  def sort_buckets(buckets)
    buckets.sort_by do |bucket|
      [
        bucket.slots_limited? ? 0 : 1,
        bucket.anything? ? 1 : 0,
        (bucket.name || '').downcase
      ]
    end
  end
end
