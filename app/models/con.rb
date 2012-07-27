require 'carrierwave/orm/activerecord'

class Con < ActiveRecord::Base
  belongs_to :updated_by, :class_name => "User"
  
  validates :signups_allowed, :inclusion => { :in => %w(not_yet 1 2 3 yes not_now) }
  validates :show_schedule, :inclusion => { :in => %w(yes gms priv no) }
  
  has_many :pages, :as => :parent
  belongs_to :root_page, :class_name => "Page"
  
  before_create :create_default_root_page
  after_create :fix_root_page_parent

  has_many :user_con_profiles
  has_many :users, :through => :user_con_profiles
  
  mount_uploader :banner_image, BannerImageUploader
  
  liquid_methods :name
  
  def started?
    starts_at && starts_at <= Time.now
  end
  
  def ended?
    ends_at && ends_at <= Time.now
  end
  
  def create_default_root_page
    return if root_page
    
    con_name = name || "Untitled con"
    content = <<-EOF
    <h1>#{con_name}</h1>
    
    <p>Welcome to #{con_name}.  Content goes here.</p>
    EOF
    
    self.create_root_page(:content => content, :name => "Home page")
  end
  
  def fix_root_page_parent
    root_page.parent = self
    root_page.save!
  end
end
