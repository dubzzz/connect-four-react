(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{177:function(e,n,t){},179:function(e,n,t){"use strict";t.r(n);var r,a=t(0),c=t.n(a),o=t(25),i=t.n(o),u=t(14),l=t(4),s=t(12),p=t(41),b=t.n(p),y=t(26);!function(e){e.None="",e.PlayerA="1",e.PlayerB="2"}(r||(r={}));var f=function(e,n){return Object(y.a)(Array(n)).map(function(n){return Object(y.a)(Array(e)).map(function(e){return r.None})})},d=6,j=7,O=4,m={grid:f(j,d),currentPlayer:r.PlayerA,winner:r.None},h=Object(l.combineReducers)({connectFour:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:m,n=arguments.length>1?arguments[1]:void 0;switch(n.type){case"NEW_GAME":return Object(s.a)({},e,{grid:f(j,d),winner:r.None});case"PLAY_AT":if(e.winner!==r.None)throw new Error("Game is over, a player already won");var t=n.payload.columnIdx,a=function(e,n,t){for(var a=e.length-1;a>=0;--a)if(e[a][n]===r.None){var c=Object(y.a)(e).map(function(e){return Object(y.a)(e)});return c[a][n]=t,c}throw new Error("Unable to play: invalid position")}(e.grid,t,e.currentPlayer),c=function(e,n,t){for(var a=0;e[a][n]===r.None;++a);var c=e[a][n],o=function(n){var t=0,r=!0,a=!1,o=void 0;try{for(var i,u=n[Symbol.iterator]();!(r=(i=u.next()).done);r=!0){var l=i.value;if(l.x<0||l.x>=e[0].length||l.y<0||l.y>=e.length||e[l.y][l.x]!==c)break;++t}}catch(s){a=!0,o=s}finally{try{r||null==u.return||u.return()}finally{if(a)throw o}}return t},i=b.a.mark(function e(n,t,r,a){return b.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=3,{x:n+=r,y:t+=a};case 3:e.next=0;break;case 5:case"end":return e.stop()}},e,this)}),u=function(e,t){return o(i(n,a,-e,-t))+o(i(n,a,e,t))+1};return u(0,1)>=t||u(1,0)>=t||u(1,1)>=t||u(1,-1)>=t}(a,t,O);return Object(s.a)({},e,{grid:a,currentPlayer:e.currentPlayer===r.PlayerA?r.PlayerB:r.PlayerA,winner:c?e.currentPlayer:r.None});default:return e}}}),v=t(60),w=Object(l.createStore)(h,Object(v.devToolsEnhancer)({})),E=(t(76),t(5)),P=t(6),N=t(8),k=t(7),A=t(9),g=(t(78),function(){return{type:"NEW_GAME",payload:null}}),C=function(e){return{type:"PLAY_AT",payload:{columnIdx:e}}},x=(t(80),t(82),t(84),function(e){function n(){return Object(E.a)(this,n),Object(N.a)(this,Object(k.a)(n).apply(this,arguments))}return Object(A.a)(n,e),Object(P.a)(n,[{key:"render",value:function(){return c.a.createElement("div",{className:"board-cell player-".concat(this.props.player)})}}]),n}(c.a.Component)),F=function(e){function n(){return Object(E.a)(this,n),Object(N.a)(this,Object(k.a)(n).apply(this,arguments))}return Object(A.a)(n,e),Object(P.a)(n,[{key:"render",value:function(){return c.a.createElement("div",{className:"board-column ".concat(this.props.playable?"playable":"not-playable"),onClick:this.props.playable?this.props.onClick:void 0},this.props.tokens.map(function(e,n){return c.a.createElement(x,{key:n,player:e})}))}}]),n}(c.a.Component),G=function(e){function n(){return Object(E.a)(this,n),Object(N.a)(this,Object(k.a)(n).apply(this,arguments))}return Object(A.a)(n,e),Object(P.a)(n,[{key:"render",value:function(){for(var e=this,n=[],t=function(t){var a=e.props.grid[0][t]===r.None&&!e.props.done,o=e.props.grid.map(function(e){return e[t]});n.push(c.a.createElement(F,{key:t,playable:a,tokens:o,onClick:a?function(){return e.props.playAt(t)}:void 0}))},a=0;a!==this.props.grid[0].length;++a)t(a);return c.a.createElement("div",{className:"board player-"+this.props.currentPlayer},n)}}]),n}(c.a.Component);var _=Object(u.b)(function(e){return{grid:e.connectFour.grid,currentPlayer:e.connectFour.currentPlayer,done:e.connectFour.winner!==r.None}},function(e){return Object(s.a)({},Object(l.bindActionCreators)({playAt:C},e))})(G),B=(t(86),t(62)),I=t.n(B),T=t(61),J=t.n(T),L=function(e){function n(){return Object(E.a)(this,n),Object(N.a)(this,Object(k.a)(n).apply(this,arguments))}return Object(A.a)(n,e),Object(P.a)(n,[{key:"render",value:function(){var e=this;return c.a.createElement("div",null,c.a.createElement(J.a,{variant:"contained",onClick:function(){return e.props.newGame()}},"New Game ",c.a.createElement(I.a,null)))}}]),n}(c.a.Component);var M=Object(u.b)(null,function(e){return Object(s.a)({},Object(l.bindActionCreators)({newGame:g},e))})(L),S=(t(177),function(e){function n(){return Object(E.a)(this,n),Object(N.a)(this,Object(k.a)(n).apply(this,arguments))}return Object(A.a)(n,e),Object(P.a)(n,[{key:"render",value:function(){var e=this.props,n=e.winner,t=e.currentPlayer;return n!==r.None?c.a.createElement("div",{className:"instructions victory player-".concat(n)},"Player #",n," won"):c.a.createElement("div",{className:"instructions player-".concat(t)},"Player #",t," turn")}}]),n}(c.a.Component));var W=Object(u.b)(function(e){return{currentPlayer:e.connectFour.currentPlayer,winner:e.connectFour.winner}},function(e){return Object(s.a)({},Object(l.bindActionCreators)({},e))})(S),Y=function(e){function n(){return Object(E.a)(this,n),Object(N.a)(this,Object(k.a)(n).apply(this,arguments))}return Object(A.a)(n,e),Object(P.a)(n,[{key:"render",value:function(){return c.a.createElement("div",{className:"connect-four-app"},c.a.createElement(W,null),c.a.createElement(_,null),c.a.createElement(M,null))}}]),n}(a.Component),R=document.getElementById("root");i.a.render(c.a.createElement(u.a,{store:w},c.a.createElement(Y,null)),R)},63:function(e,n,t){e.exports=t(179)},76:function(e,n,t){},78:function(e,n,t){},80:function(e,n,t){},82:function(e,n,t){},84:function(e,n,t){},86:function(e,n,t){}},[[63,2,1]]]);
//# sourceMappingURL=main.a768c848.chunk.js.map