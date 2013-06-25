		var margin = { top: 50, right: 0, bottom: 20, left: 40 },
          	width = 960 - margin.left - margin.right,
	        height = 480 - margin.top - margin.bottom,
          	gridSize = Math.floor(width / 24),
          	legendElementWidth = gridSize*2,
          	buckets = 9,
			barPadding = 1,
          	colors = colorbrewer.GnBu[9],
          	days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
          	times = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"]; 
 
		d3.tsv("data/data.tsv",
			function(d) {
			  return {
				day: +d.day,
				hour: +d.hour,
				value: +d.value
			  };
			},
        	function(error, data) {
			var colorScale = d3.scale.quantile()
				  	   .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
				           .range(colors);
 
			var svg = d3.select("#chart").append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				    .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				    .attr("class","chart");

		        var dayLabels = svg.selectAll(".dayLabel")
				           .data(days)
				  	   .enter().append("text")
					   .text(function (d) { return d; })
					   .attr("x", 0)
					   .attr("y", function (d, i) { return i * gridSize; })
					   .style("text-anchor", "end")
					   .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
					   .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });
 
			var timeLabels = svg.selectAll(".timeLabel")
				      	    .data(times)
				  	    .enter().append("text")
					    .text(function(d) { return d; })
					    .attr("x", function(d, i) { return i * gridSize; })
					    .attr("y", 0)
					    .style("text-anchor", "middle")
					    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
					    .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });
 
			var heatMap = svg.selectAll(".hour")
					  .data(data)
					  .enter().append("rect")
					  .attr("x", function(d) { return (d.hour - 1) * gridSize; })
					  .attr("y", function(d) { return (d.day - 1) * gridSize; })
					  .attr("rx", 4)
					  .attr("ry", 4)
					  .attr("class", "hour bordered")
					  .attr("width", gridSize)
					  .attr("height", gridSize)
					  .style("fill", colors[0]);
					  heatMap.transition().duration(1000)
              		  .style("fill", function(d) { return colorScale(d.value); })
 					  heatMap.append("title").text(function(d) { return d.value; })
					  .on("mouseover", function(d) {
					  	d3.select(this)
					  	  .style("fill","red");
					  })
					  .on("mouseout", function(d) {
					  	d3.select(this)
					  	  .transition()
					  	  .duration(120)
					  	  .style("fill", function(d) { return colorScale(d.value); })
				          });
      });

	    // HOURLY TRAFFIC//
		
		d3.tsv("data/pisa_traffic_hourly.tsv", function(error, data) {

			  data.forEach(function(d) {
				d.count = +d.count;
			  });

		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);

		var y = d3.scale.linear()
			  .range([height, 0]);

		var xAxis = d3.svg.axis()
			      .scale(x)
			      .orient("top");

		var yAxis = d3.svg.axis()
			      .scale(y)
			      .orient("left")

		var svg = d3.select("#tab").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
		            .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			    .attr("class","tab");

		

			  x.domain(data.map(function(d) { return d.h; }));
			  y.domain([0, d3.max(data, function(d) { return d.count; })]);


			  var colorScale = d3.scale.quantile()
              				     .domain([0, buckets - 1, d3.max(data, function (d) { return d.count; })])
              				     .range(colors);


			  svg.append("g")
				  .attr("class", "y axis")
				  .call(yAxis)
				  .append("text")
				  .attr("transform", "rotate(-90)")
				  .attr("y", 6)
				  .attr("dy", ".71em")
				  .style("text-anchor", "end")

			  svg.selectAll(".bar")
				  .data(data)
				  .enter()
				  .append("rect")
				  .attr("class", "bar")
				  .attr("x", function(d) { return x(d.h); })
				  .attr("width", x.rangeBand())
				  .attr("y", function(d) { return y(d.count); })
				  .attr("height", function(d) { return height - y(d.count); })
				  .style("fill", colors[0])
				  .style("fill", function(d) { return colorScale(d.count); })
				  .on("mouseover", function(d) {
				  	d3.select(this)
						.style("fill","red");
				  })
				  .on("mouseout", function(d) {
				  	d3.select(this)
					  .transition()
					  .duration(120)
					  .style("fill", function(d) { return colorScale(d.count); })	
				  });

		});
		
		d3.tsv("data/pisa_traffic_daily.tsv", type, function(error, data) {
		 //WEEKDAYS TRAFFIC//
		var x1 = d3.scale.linear()
			   .range([0, width])

		var y1 = d3.scale.ordinal()
			   .rangeRoundBands([0, height], .1);

		var xAxis1 = d3.svg.axis()
			       .scale(x1)
			       .orient("top");

		var svg1 = d3.select("#tab2").append("svg")
			     .attr("width", width + margin.left + margin.right)
			     .attr("height", height + margin.top + margin.bottom)
			     .append("g")
			     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			     .attr("class","tab1");

		

			x1.domain([0, d3.max(data, function(d) { return d.count; })]);
			y1.domain(data.map(function(d) { return d.day; }));


			var colorScale = d3.scale.quantile()
				           .domain([0, buckets - 1, d3.max(data, function (d) { return d.count; })])
				           .range(colors);

			svg1.selectAll(".bar")
				.data(data)
				.enter().append("rect")
				.attr("class", function(d) { return d.count < 0 ? "bar negative" : "bar positive"; })
				.attr("x", function(d) { return x1(Math.min(0, d.count)); })
				.attr("y", function(d) { return y1(d.day); })
				.attr("width", function(d) { return (x1(d.count) - x1(0)); })
				.attr("height", y1.rangeBand())
				.style("fill", colors[0])
				.style("fill", function(d) { return colorScale(d.count); })
				.on("mouseover", function(d) {
					d3.select(this)
					  .style("fill","red");
			        })
				.on("mouseout", function(d) {
					d3.select(this)
					  .transition()
					  .duration(120)
					  .style("fill", function(d) { return colorScale(d.count); })	
				});

			svg1.append("g")
				.attr("class", "x axis")
			    	.call(xAxis1);

			svg1.append("g")
				.attr("class", "y axis")
				.append("line")
				.attr("x", x1(0))
				.attr("x", x1(0))
				.attr("y", height);
		});

		function type(d) {
		  d.count = +d.count;
		  return d;
		}