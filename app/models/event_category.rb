class EventCategory
  DATA = JSON.parse(
    File.read(File.expand_path('config/event_categories.json', Rails.root))
  )

  attr_reader :key

  def initialize(data)
    @key = data['key']
    @recurring = !!data['recurring']
    @single_run = !!data['single_run']
  end

  def recurring?
    @recurring
  end

  def single_run?
    @single_run
  end

  def regular?
    !recurring? && !single_run?
  end

  CATEGORIES_BY_KEY = DATA.map { |item| EventCategory.new(item) }.index_by(&:key)

  def self.find(key)
    CATEGORIES_BY_KEY.fetch(key)
  end

  def self.recurring_categories
    CATEGORIES_BY_KEY.values.select(&:recurring?)
  end

  def self.regular_categories
    CATEGORIES_BY_KEY.values.select(&:regular?)
  end

  def self.single_run_categories
    CATEGORIES_BY_KEY.values.select(&:single_run?)
  end
end
