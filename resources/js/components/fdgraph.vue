<template>
<div>
  <svg id="fdg" :width= "width" :height= "height">
  </svg>
  <div id="buttonholder">
    <button type="button" id="smaller">smaller</button>
    <button type="button" id="xaxis">stretch in y-axis</button>
    <button type="button" id="dxaxis">de-stretch in y-axis</button>
    <button type="button" id="bigger">bigger</button>
    <button type="button" id="yaxis">stretch in x-axis</button>
    <button type="button" id="dyaxis">de-stretch in x-axis</button>
    <button type="button" id="backtonormal">back to normal</button>
  </div>

</div>
</template>


<script type="text/javascript">
export default{
      name: 'fdgraph',
      props: {
        enlable:Boolean,
        zoomable:Boolean,
        height: Number,
        width: Number,
        jsonfile:String,
        icons: Array
      },

      mounted:function() {

          let generalscale= -1000;
          let xscale=0.5;
          let yscale=0.5;
          let xstrength=1;
          let ystrength=1;
          let strength=1;
          let d3 = require("d3");//call d3 library
          let svg = d3.select("svg");//select the svg element defined in template
          const inputfile= this.jsonfile;//get the input file in json from parent element
          let w= this.width;
          let h = this.height;
          let xcenter= w/2;
          let ycenter= h/2;
          let enlable= this.enlable;//whether to show lables or not, taken from the parent element
          let zoomable=this.zoomable;//whether to zoom or not, taken from the parent element
          const icons= this.icons;//put icons image in an array
          let simulation = d3.forceSimulation() //Creates a new simulation with an empty array of nodes
              //simulation.force(name[, force])
              //If force is specified, assigns the force for the specified name and returns the simulation
              //A force is simply a function that modifies nodes’ positions or velocities
              //To use this module, create a simulation for an array of nodes, and compose the desired forces.
              //Then listen for tick events to render the nodes as they update in your preferred graphics system, such as Canvas or SVG.
              .force("link", d3.forceLink() //Creates a new link force with the specified links and default parameters.
                .id(function(d) { return d.id; }))
              .force("center", d3.forceCenter(xcenter, ycenter)) //Creates a new centering force with the specified x- and y- coordinates
              .force("x",d3.forceX(xcenter).strength(xscale)) //Creates a new positioning force along the x-axis towards the given position x.
                                                      // The strength determines how much to increment the node’s x-velocity
              .force("y",d3.forceY(ycenter).strength(yscale))//Creates a new positioning force along the y-axis towards the given position x.
                                                      // The strength determines how much to increment the node’s y-velocity
              .force("charge",
                d3.forceManyBody().strength(generalscale));//If strength is specified, sets the strength accessor to the specified number or function,
                                                    // re-evaluates the strength accessor for each node, and returns this force.
                                                    // A positive value causes nodes to attract each other, similar to gravity,
                                                    // while a negative value causes nodes to repel each other, similar to electrostatic charge.


        d3.json(inputfile).then(function(graph) {
        //d3.json(inputfile, function(error, graph) {
                //  if (error) throw error;

                  let g = svg.append("g") //make a group element that points to the svg element
                      .attr("class", "everything");

                  let link = svg.append("g") //make a group element that points to link elements
                              .attr("class", "links")
                              .selectAll("line")
                              .data(graph.links) //reads the links of the given graph from the input json file
                              .enter().append("line")
                              .attr("stroke-width", function(d) { //sets how thick the lines are
                                  return Math.sqrt(d.value); });


                  let node = svg.append("g") //make a group element that points to node elements
                              .attr("class", "nodes")
                              .selectAll("g")
                              .data(graph.nodes)//reads the nodes of the given graph from the input json file
                              .enter().append("g");

                  let rect= node.append("rect") //this does not let lines to collide to icons, like a white background for icons
                              .attr("width",15)
                              .attr("height", 15)
                              .attr('x', -7)
                              .attr('y', -7)
                              .attr( 'fill', 'white');
                  let iconimage= node.append("image")//this sets the icons
                              .attr("class","icons")
                              .attr("xlink:href", function(d){
                                  return icons[d.group];})
                              .attr("width", 20)
                              .attr("height", 20)
                              .attr('x', -10)
                              .attr('y', -10)
                              .call(d3.drag() //these 3 functions helps to move move the nodes
                                  .on("start", dragstarted)
                                  .on("drag", dragged)
                                  .on("end", dragended));

                  if(enlable){
                     let lables = node.append("text") //add lables to nodes
                        .attr("class", "iconnode")
                        .text(function(d) {
                          return d.id;
                        })
                        .attr('x', 10)
                        .attr('y', 3)
                        .call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended));
                    }

                    node.append("title") //add titles to nodes
                        .text(function(d) {
                            return d.id; });

                    simulation.nodes(graph.nodes)
                      .on("tick", ticked);//use simulation.on to listen for tick events as the simulation runs
                    simulation.force("link")//to draw the links
                      .links(graph.links);

                    function ticked() { //by each tick this functions is called which takes x,y of source and update a line
                                        // to x,y of target and update the position of the nodes

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
                  if(zoomable){
                      let zoom_handler = d3.zoom() //use d3 zoom handler
                           .scaleExtent([0.25, 4])
                           .on("zoom", zoom_actions);//this is called with double click and mouse event
                      zoom_handler(svg);
                      function zoom_actions(){
                          let transform = d3.zoomTransform(this);
                          this.setAttribute("transform", transform);
                          }}



                  let small= d3.select("#smaller") //make the graph smaller
                                .on("click", function(){
                                    generalscale/=1.2;
                                    simulation.force("charge",d3.forceManyBody().strength(generalscale));
                                    simulation.alpha(1).restart();

                  });
                  let big= d3.select("#bigger") //make the graph bigger
                              .on("click", function(){
                                  generalscale *=1.2;
                                  simulation.force("charge",d3.forceManyBody().strength(generalscale));
                                  simulation.alpha(1).restart();


                                  //.attr('fx',null)
                                    //        .attr('fy',null);
                                //  console.log(iconimage._groups[0]);

                                    });
                  let xaxis= d3.select("#xaxis") //make the graph stretch in y-axis
                              .on("click", function(){
                                  xscale*=1.2;
                                  if(xscale>3) xscale= 3;
                                  simulation.force("x",d3.forceX(xcenter).strength(xscale)).force("charge",d3.forceManyBody().strength(generalscale));
                                  simulation.alpha(1).restart();
                                    });
                  let yaxis= d3.select("#yaxis") //make the graph stretch in x-axis
                            .on("click", function(){
                                yscale*=1.2;
                                if(yscale>3) yscale= 3;
                                simulation.force("y",d3.forceY(ycenter).strength(yscale)).force("charge",d3.forceManyBody().strength(generalscale));
                                simulation.alpha(1).restart();
                                  });
                  let dxaxis= d3.select("#dxaxis") //make the graph de-stretch in y-axis
                              .on("click", function(){
                                  xscale/=1.2;
                                  if(xscale<0.05*0.5) xscale= 0.05*0.5;
                                  simulation.force("x",d3.forceX(xcenter).strength(xscale)).force("charge",d3.forceManyBody().strength(generalscale));
                                  simulation.alpha(1).restart();
                                    });
                  let dyaxis= d3.select("#dyaxis") //make the graph de-stretch in x-axis
                            .on("click", function(){
                                yscale/=1.2;
                                if(yscale<0.05*0.5) yscale= 0.05*0.5;
                                simulation.force("y",d3.forceY(ycenter).strength(yscale)).force("charge",d3.forceManyBody().strength(generalscale));
                                simulation.alpha(1).restart();
                                  });

          });
          function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3) //For each iteration,
                                                              //it increments the current alpha by (alphaTarget - alpha) × alphaDecay;
                                                              // then invokes each registered force, passing the new alpha;
                                                              // then decrements each node’s velocity by velocity × velocityDecay;
                                                              //lastly increments each node’s position by velocity
                .restart();//Restarts the simulation’s internal timer and returns the simulation
            d.fx = d.x; //fx - the node’s fixed x-position
            d.fy = d.y; //fy - the node’s fixed y-position
          }
          function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;

          }
          function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = d.x;
            d.fy = d.y;
            console.log(d);
          }

                    let b=svg.append("g") //brush and zoom
                      .attr("class", "brush")
                      .call(d3.brush()
                      .extent( [ [0,0], [w,h] ] )
                      .on("end", zooming));

                    function zooming() {
                      if (d3.event.selection) { //if selection happens
                          let selection = d3.event.selection; //get the selection
                          //set the new center
                          xcenter=w- (selection[0][0]+selection[1][0])/2;
                          ycenter=h- (selection[0][1]+selection[1][1])/2;
                          //get width and heigth of brush element
                          let xd= selection[1][0]-selection[0][0];
                          let yd= selection[1][1]-selection[0][1];
                          //calculate the xscale and yscale and find the min to apply
                          let zaribx= w/xd;
                          let zariby=h/yd;
                          let zarib= 0;
                          if(zaribx>zariby) zarib=zariby; else zarib=zaribx;
                          //apply the min scale to strenghts
                          generalscale*= zarib;
                          xscale /= zarib;
                          yscale /= zarib;
                          //define the simulation again
                          simulation.stop();
                          simulation.force("center", d3.forceCenter(xcenter,ycenter)) //change the center to the brush element center
                          //change force strengths according to scales
                          .force("x",d3.forceX(xcenter).strength(xscale))
                          .force("y",d3.forceY(ycenter).strength(yscale))
                          .force("charge",d3.forceManyBody().strength(generalscale));
                          simulation.alpha(1).restart(); //start the simulation

                          //some css changes to the brush element so that it won't be shown like a gray box anymore after zooming
                          d3.selectAll(".selection")
                          .attr("x",0)
                          .attr("y",0)
                          .attr("width",0)
                          .attr("height",0)
                          .attr("cursor","crosshair");

                          d3.selectAll(".handle")
                          .attr("x",0)
                          .attr("y",0)
                          .attr("width",0)
                          .attr("height",0)
                          .attr("cursor","crosshair");

                        }
                      }

                    let backtonormal= d3.select("#backtonormal") //make it back to initial state
                                .on("click", function(){
                                    simulation.stop();
                                    generalscale=-1000;
                                    xscale=0.5;
                                    yscale=0.5;
                                    xcenter= w/2;
                                    ycenter= h/2;
                                  simulation.force("center", d3.forceCenter(xcenter, ycenter))
                                      .force("x",d3.forceX(xcenter).strength(xscale))
                                      .force("y",d3.forceY(ycenter).strength(yscale))
                                      .force("charge",
                                        d3.forceManyBody().strength(generalscale));
                                        simulation.alpha(1).restart();
                                      });

}
    }

</script>

<style lang="css">
    svg{
      display: inline-block;
      float: left;
      border: solid black 1px;
      border-radius: 1rem;
    }
    button{
      margin-left: 1%;
      margin-top: 2%;
      border-radius: 1rem;
      background-color: #b6c0e2;
    }
    button:hover{
      cursor: pointer;
      background-color: #565bcb;
      box-shadow: 2px 2px 2px 2px rgba(60, 24, 255, 0.3);
      transition: all 0.3s ease 0s;
      color: white;
    }
    #buttonholder{
      padding-top: 10%;
      display: inline-block;
      width: 23%;
    }
    .links line {
      stroke: #999;
      stroke-opacity: 0.6;
    }

    .nodes circle {
      stroke: #fff;
      stroke-width: 1.5px;
    }

    text {
      fill:black;
      font-family: sans-serif;
      font-size: 10px;
    }

    .icons{
      z-index: 10;
    }
    .iconnode{
        fill:black;
        z-index: 10;
    }

</style>
