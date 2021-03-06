var React = require('react/dist/react.min');
var ReactDOM = require('react-dom/dist/react-dom.min');
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var $ = require('jquery');
var _ = require('lodash');

var size = 20000;
var initial = [];
var timeOut = 0;
var mod = 5;
for (var i = 0; i < size; ++i) {
  initial.push(i);
}
var inverse = initial.map(function (d) {
  return d % mod ? d : ~d;
});

var style = {
  table: {
    style: {
      width: '100%',
      textAlign: 'center',
      fontSize: '1em',
      fontFamily: 'Helvetica, sans-serif',
      lineHeight: '1em'
    }
  },
  row: {
    style: {
    }
  },
  cell: {
    style: {
      border: '1px solid #eee',
      padding: '1em'
    }
  }
};

var $test = $('#test');
var testEl = document.getElementById('test');

function jquery () {

  function renderTable (data) {
    return table = $('<table />', {css: style.table.style, id: 'jquery-table'}).html(data.map(function (d) {
      return $('<tr />', {css: style.row.style}).html(
        $('<td />', {css: style.cell.style, text: d})
      );
    }));
  }

  function renderLodashTable (data) {
    var template = _.template('<table style="width: 100%; text-align: center; font-size: 1em; font-family: Helvetica, sans-serif; line-height: 1em;"><% _.forEach(data, function (d) { %><tr style=""><td style="border: 1px solid #eee; padding: 1em;"><%= d %></td></tr><% }); %></table>');
    return template(data);
  }

  var t0 = performance.now();
  $test.html(renderLodashTable({data: initial}));
  var t1 = performance.now();
  var time1 = t1-t0;
  console.log('JQUERY');
  console.log(time1, 'ms initial render');

  window.setTimeout(function () {
    var t0 = performance.now();
    $test.html(renderLodashTable({data: inverse}));
    var t1 = performance.now();
    var time2 = t1-t0;
    console.log(time2, 'ms redraw');

    $test.html('<p>Initial: ' + time1 + ' redraw: ' + time2 + '</p>');
  }, timeOut);
}

function react () {
  var Table = React.createClass({
    getInitialState: function () {
      return {data: initial};
    },

    render: function () {
      return <table style={style.table.style}>
        {this.state.data.map((d) => <tr style={style.row.style}><td style={style.cell.style}>{d}</td></tr>)}
      </table>
    }
  });

  var t0 = performance.now();
  var component = ReactDOM.render(<Table data={initial} />, testEl);
  var t1 = performance.now();
  var time1 = t1-t0;
  console.log('REACT');
  console.log(time1, 'ms initial render');

  window.setTimeout(function () {
    var t0 = performance.now();
    component.setState({data: inverse});
    var t1 = performance.now();
    var time2 = t1-t0;
    console.log(time2, 'ms redraw');

    $test.html('<p>Initial: ' + time1 + ' redraw: ' + time2 + '</p>');
  }, timeOut);
}

function virtualDom () {
  function renderTable (data) {
    return h('table', style.table, data.map(function (d) {
      return h('tr', style.row, h('td', style.cell, String(d)));
    }));
  }

  var t0 = performance.now();
  var tree = renderTable(initial);
  var rootNode = createElement(tree);
  testEl.appendChild(rootNode);
  var t1 = performance.now();
  var time1 = t1-t0;
  console.log('VIRTUAL DOM');
  console.log(time1, 'ms initial render');

  window.setTimeout(function () {
    var t0 = performance.now();
    var newTree = renderTable(inverse);
    var patches = diff(tree, newTree);
    rootNode = patch(rootNode, patches);
    tree = newTree;
    var t1 = performance.now();
    var time2 = t1-t0;
    console.log(time2, 'ms redraw');
    $test.html('<p>Initial: ' + time1 + ' redraw: ' + time2 + '</p>');
  }, timeOut);
}

window.tests = {
  jquery: jquery,
  react: react,
  virtualDom: virtualDom
};
