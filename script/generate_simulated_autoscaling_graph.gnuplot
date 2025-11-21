set terminal png size 1200,600
set output 'scaling-graph.png'
set datafile separator ','
set xdata time
set timefmt '%Y-%m-%d %H:%M:%S'
set format x '%I:%M%p'
set xlabel 'Time'
set ylabel 'Servers'
set title 'Autoscaling Servers'
set autoscale yfix
set yrange [0:*]
set offsets 0,0,graph 0.1,0
plot 'scaling-graph.csv' skip 1 using 1:2 with lines notitle
