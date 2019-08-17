<!DOCTYPE html>
<html>

<head>
<meta charset="utf-8">


<!-- <script src="https://unpkg.com/vue@2.1.10/dist/vue.js"></script> -->
<style>

</style>


</head>



<body >

  <div id="app">
    <fdgraph :width="960" :height="600"
    routerimg="icons/router.svg" serverimg="icons/servers.svg" clientimg="icons/pc-screen.svg"
    :enlable="true" :zoomable="true"
    ></fdgraph>

  </div>


    <!-- <div id="fggraph">
      <fggraph
      :width="960" :height="600"
      routerimg="icons/router.svg" serverimg="icons/servers.svg" clientimg="icons/pc-screen.svg"
      :enlable="true" :zoomable="true"
      ></fggraph>
    </div> -->
<script src="js/app.js"></script>
</body>
<!-- <script src="./js/app.js">

      </script> -->
</html>
