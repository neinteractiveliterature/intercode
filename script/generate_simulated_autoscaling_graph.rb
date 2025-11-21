require "csv"

Time.use_zone "America/New_York" do
  time = Time.zone.local(2025, 11, 24, 12)
  data = []
  while time < Time.zone.local(2025, 11, 25, 12)
    data << [time, AutoscaleServersService.scaling_target_for(time)]
    time += 15.minutes
  end

  puts "Writing simulated autoscaling data to scaling-graph.csv"

  CSV.open("scaling-graph.csv", "w") do |csv|
    csv << %w[Time Servers]
    data.each { |row| csv << row }
  end

  puts "Plotting graph to scaling-graph.png"

  system <<~SH
    gnuplot -c ./script/generate_simulated_autoscaling_graph.gnuplot
  SH
end
