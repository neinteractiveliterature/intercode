require 'carrierwave/orm/activerecord'
require File.expand_path('lib/domain_validator')

class Convention < ActiveRecord::Base
  include Authority::Abilities

  belongs_to :updated_by, :class_name => "User"
  
  validates :signups_allowed, :inclusion => { :in => %w(not_yet 1 2 3 yes not_now no) }
  validates :show_schedule, :inclusion => { :in => %w(yes gms priv no) }

  validates :domain, uniqueness: true, :domain => true

  validates_date :start_date, :allow_blank => true
  validates_date :end_date, :on_or_after => :start_date, :allow_blank => true

  has_many :pages, :as => :parent
  belongs_to :root_page, :class_name => "Page"
  
  before_create :create_default_root_page
  after_create :fix_root_page_parent

  has_many :user_con_profiles
  has_many :users, :through => :user_con_profiles
  
  mount_uploader :banner_image, BannerImageUploader
  
  liquid_methods :name
  
  def started?
    start_date && start_date <= Date.today
  end
  
  def ended?
    end_date && end_date <= Date.today
  end

  def current?
    start_date && end_date && start_date <= Date.today && end_date >= Date.today
  end

  def upcoming?
    start_date && start_date >= Date.today
  end

  def unspecified?
    start_date == nil || end_date == nil
  end

  def create_default_root_page
    return if root_page
    
    con_name = title || "Untitled con"
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
