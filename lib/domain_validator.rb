# 
# Domain Validator by Frank Rietta
# (C) 2012 Rietta Inc. All Rights Reserved.
# Licensed under terms of the BSD License.
#
# To use in a validation, add something like this to your model:
#
#   validates :name, :domain => true
#
class DomainValidator < ActiveModel::EachValidator

  def validate_each(record, attribute, value)
    
    # The shortest possible domain name something like Google's g.cn, which is four characters long
    # The longest possible domain name, as per RFC 1035, RFC 1123, and RFC 2181 is 253 characters
    if value.to_s.length < 4
      record.errors[attribute] << (options[:message] || "is invalid as a bare domain name because it is too short")
    elsif value.length > 253
      record.errors[attribute] << (options[:message] || "is invalid as a bare domain name because it is too long")
    elsif value.include?("://")
      record.errors[attribute] << (options[:message] || "is invalid as a bare domain name because it includes a protocol seperator (://)")
    elsif value.include?("/")
      record.errors[attribute] << (options[:message] || "is invalid as a bare domain name because it includes forward slashes (/)")
    elsif !value.include?(".")
      record.errors[attribute] << (options[:message] || "is invalid as a bare domain name because it doesn't contain any dots (.)")
    else
      
      # Finally, see if the URI parser recognizes this as a valid URL when given a protocol;
      # remember, we have already rejected any value that had a protocol specified already
      valid = begin
        URI.parse("http://" + value).kind_of?(URI::HTTP)
      rescue URI::InvalidURIError
        false
      end
      
      unless valid
          record.errors[attribute] << (options[:message] || "is an invalid domain")
      end
    
    end
        
  end # validate_each

end # DomainValidator