var width = 1020;
var height = 700;
// nodeの定義。ここを増やすと楽しい。
var nodes = [
  {
    id: 0,
    label: "CODE",
    r: 50,
    fontSize: 50
  },
  {
    id: 1,
    label: "JS",
    r: 20,
    fontSize: 20
  },
  {
    id: 2,
    label: "HTML/CSS",
    r: 20,
    fontSize: 20
  },
  {
    id: 3,
    label: "C++",
    r: 20,
    fontSize: 20
  },
  {
    id: 4,
    label: "P5.js",
    r: 20,
    fontSize: 20
  },
  {
    id: 5,
    label: "rails",
    r: 20,
    fontSize: 20
  },
  {
    id: 6,
    label: "ruby",
    r: 20,
    fontSize: 20
  },
  {
    id: 7,
    label: "python",
    r: 20,
    fontSize: 20
  },
  {
    id: 8,
    label: "DESIGN",
    r: 50,
    fontSize: 50
  },
  {
    id: 9,
    label: "JS",
    r: 20,
    fontSize: 20
  },
  {
    id: 10,
    label: "HTML/CSS",
    r: 20,
    fontSize: 20
  },
  {
    id: 11,
    label: "C++",
    r: 20,
    fontSize: 20
  },
  {
    id: 12,
    label: "P5.js",
    r: 20,
    fontSize: 20
  },
  {
    id: 13,
    label: "rails",
    r: 20,
    fontSize: 20
  },
  {
    id: 14,
    label: "ruby",
    r: 20,
    fontSize: 20
  },
  {
    id: 15,
    label: "python",
    r: 20,
    fontSize: 20
  }
];

var radius = 20;
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
  { source: 8, target: 14 },
  { source: 8, target: 15 }
];

// forceLayout自体の設定はここ。ここをいじると楽しい。
var force = d3.layout
  .force()
  .nodes(nodes)
  .links(links)
  .size([width, height])
  .distance(10) // node同士の距離
  .friction(0.5) // 摩擦力(加速度)的なものらしい。
  .linkDistance(50)
  .charge(10) // 寄っていこうとする力。推進力(反発力)というらしい。
  .gravity(0.3) // 画面の中央に引っ張る力。引力。
  .start();

// svg領域の作成
var svg = d3
  .select("#relation")
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
  .attr({
    x: -50,
    y: -50,
    width: "100px",
    height: "100px"
  })
  .style({
    fill: "1f1f1f"
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
    fill: "white"
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
