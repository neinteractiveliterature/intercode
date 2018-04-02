module Concerns::SendCsv
  def configure_csv_headers(csv_filename)
    headers['X-Accel-Buffering'] = 'no'
    headers['Cache-Control'] = 'no-cache'
    headers['Content-Type'] = 'text/csv; charset=utf-8'
    headers['Content-Disposition'] = %(attachment; filename="#{csv_filename}")
    headers['Last-Modified'] = Time.zone.now.ctime.to_s
  end
end
