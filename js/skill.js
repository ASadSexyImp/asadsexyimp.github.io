var width = 1020;
var height = 700;
// nodeの定義。ここを増やすと楽しい。
var nodes = [
  {id: 0, label: "CODE", r: 88, fontSize: 48, color: "#0737ff", x: 340},
  {id: 1, label: "JS", r: 32, fontSize: 20, color: "#f9f9f9", x: 340},
  {id: 2, label: "HTML/CSS", r: 32, fontSize: 16, color: "#f9f9f9", x: 340},
  {id: 3, label: "C++", r: 32, fontSize: 16, color: "#f9f9f9", x: 340},
  {id: 4, label: "P5.js", r: 64, fontSize: 28, color: "#f9f9f9", x: 340},
  {id: 5, label: "rails", r: 32, fontSize: 16, color: "#f9f9f9", x: 340},
  {id: 6, label: "ruby", r: 32, fontSize: 16, color: "#f9f9f9", x: 340},
  {id: 7, label: "python", r: 32, fontSize: 16, color: "#f9f9f9", x: 340},

  {id: 8, label: "DESIGN", r: 88, fontSize: 48, color: "#9f1d19", x: 680},
  {id: 9, label: "Premiere Pro", r: 32, fontSize: 20, color: "#f9f9f9", x: 680},
  {id: 10, label: "Maya", r: 48, fontSize: 20, color: "#f9f9f9", x: 680},
  {id: 11, label: "Lightroom", r: 32, fontSize: 20, color: "#f9f9f9", x: 680},
  {id: 12, label: "Photoshop", r: 32, fontSize: 20, color: "#f9f9f9", x: 680},
  {id: 13, label: "Illustlator", r: 32, fontSize: 20, color: "#f9f9f9", x: 680},
  {id: 14, label: "After Effects", r: 48, fontSize: 20, color: "#f9f9f9", x: 680},
];

var radius = 25;
// node同士の紐付け設定。実用の際は、ここをどう作るかが難しいのかも。
var links = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
  { source: 0, target: 3 },
  { source: 0, target: 4 },
  { source: 0, target: 5 },
  { source: 0, target: 6 },
  { source: 0, target: 7 },
  { source: 8, target: 9 },
  { source: 8, target: 10 },
  { source: 8, target: 11 },
  { source: 8, target: 12 },
  { source: 8, target: 13 },
  { source: 8, target: 14 }
];

// forceLayout自体の設定はここ。ここをいじると楽しい。
var force = d3.layout
  .force()
  .nodes(nodes)
  .links(links)
  .size([width, height])
  .distance(50) // node同士の距離
  .friction(0.3) // 摩擦力(加速度)的なものらしい。
  .linkDistance(100)
  .charge(150) // 寄っていこうとする力。推進力(反発力)というらしい。
  .gravity(1) // 画面の中央に引っ張る力。引力。
  .start();

// svg領域の作成
var svg = d3
  .select(".web-box")
  .append("svg")
  .attr({ width: width, height: height });

// link線の描画(svgのline描画機能を利用)
var link = svg
  .selectAll("line")
  .data(links)
  .enter()
  .append("line")
  .style({
    stroke: "white",
    "stroke-width": 1
  });

// nodesの描画(今回はsvgの円描画機能を利用)
var node = svg
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r", function(d) {
    return d.r;
  })
  .attr("x", function(d) {
    return d.x;
  })
  .attr({
    y: -50
  })
  .style({
    fill: "1f1f1f",
    "-webkit-box-shadow": "0px 0px 90px 32px rgba(249,249,249,1)",
    "-moz-box-shadow": "0px 0px 90px 32px rgba(249,249,249,1)",
    "box-shadow": "0px 0px 90px 32px rgba(249,249,249,1)"
  })
  .style( "stroke", function(d) {
      return d.color;
  })
  .call(force.drag);

// nodeのラベル周りの設定
var label = svg
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .attr({
    "text-anchor": "middle",
    fill: "white",
  })
  .attr(
    "font-size", function(d){
      return d.fontSize;
    }
  )
  .text(function(data) {
    return data.label;
  });

// tickイベント(力学計算が起こるたびに呼ばれるらしいので、座標追従などはここで)
force.on("tick", function() {
  link.attr({
    x1: function(data) {
      return data.source.x;
    },
    y1: function(data) {
      return data.source.y;
    },
    x2: function(data) {
      return data.target.x;
    },
    y2: function(data) {
      return data.target.y;
    }
  });
  node.attr({
    cx: function(data) {
      return data.x;
    },
    cy: function(data) {
      return data.y;
    }
  });

  // labelも追随するように
  label.attr({
    x: function(data) {
      return data.x;
    },
    y: function(data) {
      return data.y;
    }
  });
  node
    .each(collide(0.5))
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
});

var padding = radius * 5; // separation between circles

function collide(alpha) {
  var quadtree = d3.geom.quadtree(force.nodes());
  return function(d) {
    var rb = 2 * radius + padding,
      nx1 = d.x - rb,
      nx2 = d.x + rb,
      ny1 = d.y - rb,
      ny2 = d.y + rb;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && quad.point !== d) {
        var x = d.x - quad.point.x,
          y = d.y - quad.point.y,
          l = Math.sqrt(x * x + y * y);
        if (l < rb) {
          l = ((l - rb) / l) * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}
