<!DOCTYPE html>
<html>

<head>
<meta charset="utf-8">
<script src="https://unpkg.com/vue@2.1.10/dist/vue.js"></script>
<script src="https://d3js.org/d3.v4.min.js"></script>

<style>

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


</head>



<body >

<div id="fggraph">
  <fggraph
  :width="960" :height="600"
  routerimg="icons/router.svg" serverimg="icons/servers.svg" clientimg="icons/pc-screen.svg"
  :enlable="true" :zoomable="true"
  ></fggraph>
</div>

</body>

<script src="js/fgGraph.js"></script>
</html>
