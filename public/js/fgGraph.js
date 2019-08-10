

Vue.component('fggraph', {
	//props: ['w','h','routerimg','serverimg','clientimg','zoomable','enlable'],
	props: {
		enlable:Boolean,
		zoomable:Boolean,
		height: Number,
		width: Number,
		routerimg:String,
		serverimg:String,
		clientimg:String
	},

	template: `

<svg id="fdg" :width= "width" :height= "height">
</svg>

	`,
	mounted:function() {

		//console.log(this.routerimg);

	    var svg = d3.select("svg");
			var w= this.width;
	    var h = this.height;
			console.log(this.zoomable);
			var enlable= this.enlable;
			var zoomable=this.zoomable;

				//console.log(this.routerimg);
	    var icons= [0,this.routerimg,this.serverimg,this.clientimg];
		//	console.log(routerimg);
	    var simulation = d3.forceSimulation()
	        .force("link", d3.forceLink().id(function(d) { return d.id; }))
	        .force("center", d3.forceCenter(w/2, h/2))
	        .force("x",d3.forceX(w/2).strength(0.5))
	        .force("y",d3.forceY(h/2).strength(0.5))
	        .force("charge",d3.forceManyBody().strength(-1000));

	    d3.json("rsc.json", function(error, graph) {
	      if (error) throw error;


	      var g = svg.append("g")
	          .attr("class", "everything");

	      var link = svg.append("g")
	          .attr("class", "links")
	        .selectAll("line")
	        .data(graph.links)
	        .enter().append("line")
	          .attr("stroke-width", function(d) { return Math.sqrt(d.value); });


	      var node = svg.append("g")
	          .attr("class", "nodes")
	        .selectAll("g")
	        .data(graph.nodes)
	        .enter().append("g");

	    var rect= node.append("rect")
	                .attr("width",15)
	                .attr("height", 15)
	                .attr('x', -7)
	                .attr('y', -7)
	                .attr( 'fill', 'white');

	    var serverrouterclient= node.append("image")
	                .attr("class","icons")
	                .attr("xlink:href", function(d){
	                  //console.log(d.group);
	                  //console.log(icons[d.group]);
	                  return icons[d.group];})
	                .attr("width", 20)
	                .attr("height", 20)
	                .attr('x', -10)
	                .attr('y', -10)
	                .call(d3.drag()
	                    .on("start", dragstarted)
	                    .on("drag", dragged)
	                    .on("end", dragended));

			if(enlable)
	     { var lables = node.append("text")
	          .attr("class", "iconnode")
	          .text(function(d) {
	            return d.id;
	          })
	          .attr('x', 6)
	          .attr('y', 3)
	          .call(d3.drag()
	              .on("start", dragstarted)
	              .on("drag", dragged)
	              .on("end", dragended));}

	      node.append("title")
	          .text(function(d) { return d.id; });

	     simulation
	          .nodes(graph.nodes)
	          .on("tick", ticked);

	    simulation.on("tick", ticked);

	     simulation.force("link")
	       .links(graph.links);

	          //add zoom capabilities


	      function ticked() {
	        link
	            .attr("x1", function(d) { return d.source.x; })
	            .attr("y1", function(d) { return d.source.y; })
	            .attr("x2", function(d) { return d.target.x; })
	            .attr("y2", function(d) { return d.target.y; });

	        node
	            .attr("transform", function(d) {
	              return "translate(" + d.x + "," + d.y + ")";
	            })

	      }

	      /*d3.select("#fdg").call( d3.brush()                     // Add the brush feature using the d3.brush function
	            .extent( [ [0,0], [width,height] ] )
	            .on("end", updateChart)      // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
	          );

	           function updateChart() {


	               var zoom_handler = d3.zoom()
	                   .scaleExtent([1 , 4])
	                   .on("zoom", zoom_actions);

	                   zoom_handler(this);
	               }

	    */
			if(zoomable){
			var zoom_handler = d3.zoom()
	         .scaleExtent([0.25, 4])
	        .on("zoom", zoom_actions);
	      zoom_handler(svg);
	      function zoom_actions(){

	        var transform = d3.zoomTransform(this);
	        console.log(d3.event.transform);
	        this.setAttribute("transform", transform);
	      }}




	    });

	    /*function updateChart() {
	      console.log("updatechart called");
	       }
	    // Add a clipPath: everything out of this area won't be drawn.
	    function zoom() {
	    svg.attr("transform", d3.event.transform);
	    }

	    // Add brushing
	    d3.select("#fdg")
	      .call( d3.brush()                     // Add the brush feature using the d3.brush function
	      .extent( [ [0,0], [width,height] ] )       // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
	    ).d3.zoom()
	        .scaleExtent([1, Infinity])
	        .translateExtent([[0, 0], [width, height]])
	        .extent([[0, 0], [width, height]])
	        .on("zoom", zoom);
	    */


	    function dragstarted(d) {
	      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	      d.fx = d.x;
	      d.fy = d.y;
	    }

	    function dragged(d) {
	      d.fx = d3.event.x;
	      d.fy = d3.event.y;
	    }

	    function dragended(d) {
	      if (!d3.event.active) simulation.alphaTarget(0);
	      d.fx = d.x;
	      d.fy = d.y;
	    }
	  }
	}

)

new Vue({
	el:'#fggraph'
})
