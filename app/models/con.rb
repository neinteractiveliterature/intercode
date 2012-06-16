class Con < ActiveRecord::Base
  belongs_to :updated_by, :class_name => "User"
  
  validates :signups_allowed, :inclusion => { :in => %w(not_yet 1 2 3 yes not_now) }
  validates :show_schedule, :inclusion => { :in => %w(yes gms priv no) }
  
  has_many :virtual_hosts
  has_many :pages, :as => :parent
  belongs_to :root_page, :class_name => "Page"
  
  before_create :create_default_root_page
  
  def started?
    starts_at <= Time.now
  end
  
  def ended?
    ends_at <= Time.now
  end
  
  def create_default_root_page
    return if root_page
    
    con_name = name || "Untitled con"
    content = <<-EOF
    <h1>#{con_name}</h1>
    
    <p>Welcome to #{con_name}.  Content goes here.</p>
    EOF
    
    create_root_page(:content => content, :parent => self, :name => "Home page")
  end
end
