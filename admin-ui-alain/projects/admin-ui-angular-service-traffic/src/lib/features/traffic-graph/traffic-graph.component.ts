import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import * as d3 from 'd3';
import d3tip from 'd3-tip';
import { ACTIONS } from '../../entities/actions';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'service-traffic-graph',
  template: `
    <div #traffic class="micro-topo-chart noselect">
      <div class="traffic-legend">
        <svg width="100%" height="100%">
          <defs>
            <marker id='head' orient='auto' markerWidth='2' markerHeight='4'
                    refX='0.1' refY='2'>
              <path d='M0,0 V4 L2,2 Z' fill='red'/>
            </marker>
          </defs>
          <g>
            <rect width="100%" height="100%" rx="4" ry="4" fill="white"></rect>
            <path d="M 20 20 L 100 20" stroke="green"></path>
            <text class="legend-text" x="105" y="24">错误率 < 1%</text>
            <path d="M 20 45 L 100 45" stroke="#FFAB2B"></path>
            <text class="legend-text" x="105" y="49">错误率 < 20%</text>
            <path d="M 20 70 L 100 70" stroke="#B70000"></path>
            <text class="legend-text" x="105" y="74">错误率 > 20%</text>
            <path d="M 20 95 L 100 95" stroke="#8D8D8D"></path>
            <text class="legend-text" x="105" y="99">无访问</text>
            <path d="M 20 120 L 100 120" stroke="#217EF2"></path>
            <text class="legend-text" x="105" y="124">TCP连接</text>
          </g>
        </svg>
      </div>
    </div>
  `,
  styleUrls: ['./traffic-graph.component.less'],
  providers: [],
  encapsulation: ViewEncapsulation.None
})
export class TrafficGraphComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() onSelect$ = new EventEmitter<any>();

  height: any;
  width: any;
  datas: any;

  @ViewChild('traffic') containerEl: ElementRef;
  $el: any;
  svg: any;
  tip: any;
  gwtipName: any;
  tipName: any;
  force: any;
  graph: any;
  gwnode: any;
  node: any;
  line: any;
  lineText: any;
  lineNode: any;
  defs: any;
  arrowMarker: any;
  gnode: any;
  vnode: any;
  glink: any;
  link: any;

  projectCode;
  coordSetting: CoordSetting;

  constructor(public cache: CacheService) {
  }

  ngOnInit(): void {
    this.removeThisUntilSprint12();

    this.projectCode = this.cache.getNone('projectCode') as string;
    try {
      this.coordSetting = { ...this.loadAllCoordSettings()[this.projectCode] };
    } catch (e) {
    }
  }

  removeThisUntilSprint12() {
    localStorage.removeItem('traffic-topo-graph-sc');
  }

  ngAfterViewInit(): void {
    this.$el = this.containerEl.nativeElement;
    this.mounted();
  }

  mounted(): void {
    // window.addEventListener('resize', this.resize);
    this.tip = d3tip()
      .attr('class', 'd3-tip-grey')
      .offset([-8, 0])
      .html(d => {
        return `
          <div class="mb-5"><span class="grey">callType: </span>${d.callType || ''}</div>
          <div class="mb-5"><span class="grey">cpm: </span>${d.cpm || ''}</div>
          <div class="mb-5"><span class="grey">detectPoint: </span>${d.detectPoint || 'CLIENT'}</div>
          <div><span class="grey">latency: </span>${d.latency || ''}</div>
        `;
        // <div class="mb-5"><span class="grey">detectPoint: </span>${this.$store.state.rocketTopo.mode ? d.detectPoint : 'CLIENT'}</div>
      });
    this.tipName = d3tip()
      .attr('class', 'd3-tip-grey')
      .offset([-8, -6])
      .html(d => {
        return `<div>${d.name}</div>`;
      });

    this.gwtipName = d3tip()
      .attr('class', 'd3-tip-grey')
      .offset([-8, -1])
      .html(d => {
        return `<div>${d.name}</div>`;
      });

    this.height = this.$el.clientHeight;
    this.svg = d3
      .select(this.$el)
      .append('svg')
      .style('display', 'block')
      .attr('width', '100%')
      .attr('height', this.height - 20);
  }

  ngOnDestroy(): void {
    // this.tip.hide({}, this);
    window.removeEventListener('resize', this.resize);
    d3.selectAll('.d3-tip-grey').remove();
  }

  calc(data) {
    const padding = 20;
    const vHeight = 100;
    const vWidth = 200;
    const centerWidth = 600;
    data.outters = JSON.parse(JSON.stringify(data.gateways));

    data.gateways.forEach((g, i) => {
      g.w = 100;
      g.h = 50;
      g.x = 50;
      g.y = this.height / 4 + i * padding + i * g.h;
    });

    data.nodes.forEach(d => {
      d.versions.forEach(v => {
        v.parent = d;
      });
    });

    // data.outters.forEach((o, i) => {
    //   o.w = 120;
    //   o.h = 50;
    //   o.x = 50 + centerWidth;
    //   o.y = this.height / 4 + i * padding + i * o.h;
    // });

    return data;
  }

  findVersion(d, vid) {
    for (let i = 0; i < d.nodes.length; i++) {
      const tar = d.nodes[i].versions.find(v => v.id === vid);
      if (tar) return tar;
    }
  }

  draw(d: any) {
    d.calls.forEach(c => {
      // c.rate = (Math.random() * 100 < 50 ? 0.05 :
      //   Math.random() * 100 < 50 ? 15 :
      //     Math.random() * 100 < 50 ? 25 : 0).toFixed(1);

      if (c.type === 'gateway') {
        c.source = d.gateways.find(g => g.id === c.source);
        c.target = d.nodes.find(s => s.id === c.target);
      } else if (c.type === 'service') {
        c.source = d.nodes.find(s => s.id === c.source);
        c.target = this.findVersion(d, c.target);
      } else if (c.type === 'version') {
        c.source = this.findVersion(d, c.source);
        c.target = d.nodes.find(s => s.id === c.target);
      }
    });

    this.datas = this.calc(d);
    const that = this;
    this.svg.select('.graph').remove();
    this.force = d3
      .forceSimulation(this.datas.nodes)
      .force('collide', d3.forceCollide().radius(() => 90))
      .force('yPos', d3.forceY().strength(1))
      .force('xPos', d3.forceX().strength(1))
      .force('charge', d3.forceManyBody().strength(-600));
    // .force('link', d3.forceLink(this.datas.calls).id(d => {
    //   console.log(d);
    //   return d.id;
    // }))
    if (!this.hasSavedCoor()) {
      this.force.force('center', d3.forceCenter(450, this.height / 3 + 50))
    }
    this.force.on('tick', () => that.tick());
    this.force.stop();

    this.graph = this.svg.append('g').attr('class', 'graph');
    this.svg.call(this.getZoomBehavior(this.graph));
    this.graph.call(this.tip);
    this.graph.call(this.tipName);
    this.graph.call(this.gwtipName);
    this.svg.on('click', (d, i) => {
      event.stopPropagation();
      event.preventDefault();
      that.dispatch(ACTIONS.CLEAR);
      // this.$store.commit('rocketTopo/SET_NODE', {});
      // this.$store.dispatch('rocketTopo/CLEAR_TOPO_INFO');
      that.tip.hide({}, this);
      this.toggleNode(this.node, d, false);
      // this.toggleLine(this.line, d, false);
      // this.toggleLine(this.lineNode, d, false);
    });
    this.defs = this.graph.append('defs');
    this.arrowMarker = this.defs
      .append('marker')
      .attr('id', 'arrow')
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', '12')
      .attr('markerHeight', '12')
      .attr('viewBox', '0 0 12 12')
      .attr('refX', '11')
      .attr('refY', '6')
      .attr('orient', 'auto');
    const arrow_path = 'M2,2 L10,6 L2,10 L3,6 L2,2';
    this.arrowMarker.append('path').attr('d', arrow_path).attr('fill', '#217EF2');

    const gwnode = this.graph.append('g').selectAll('.gwnode');
    this.gwnode = gwnode.data(this.datas.gateways)
      .enter()
      .append('g')
      .on('click', (d) => {
        event.stopPropagation();
        event.preventDefault();
        that.dispatch(ACTIONS.GATEWAY, d);
      })
      .on('mouseover', function (d, i) {
        that.gwtipName.show(d, this);
      })
      .on('mouseout', function (d, i) {
        that.gwtipName.hide(d, this);
      });
    this.gwnode.append('rect')
      .attr('class', 'gateway-node')
      .attr('fill', '#00B700')
      .attr('width', d => d.w)
      .attr('height', d => d.h)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('x', d => d.x)
      .attr('y', d => d.y);
    this.gwnode.append('text')
      .attr('class', 'gateway-text')
      .attr('x', d => d.x + 15)
      .attr('y', d => d.y + 29)
      .style('fill', '#FFF')
      .text(d => d.name.length > 8 ? `${d.name.substring(0, 8)}..` : d.name)
      .on('click', (d) => {
        event.stopPropagation();
        event.preventDefault();
        that.dispatch(ACTIONS.GATEWAY, d);
      });

    // const otrnode = this.graph.append('g').selectAll('.otrnode');
    // const otrs = otrnode.data(this.datas.outters)
    //   .enter()
    //   .append('g');
    // // .on('click', (d) => {
    // //   event.stopPropagation();
    // //   event.preventDefault();
    // //   that.dispatch(ACTIONS.GATEWAY, d);
    // // })
    // // .on('mouseover', function (d, i) {
    // //   that.gwtipName.show(d, this);
    // // })
    // // .on('mouseout', function (d, i) {
    // //   that.gwtipName.hide(d, this);
    // // });
    // otrs.append('rect')
    //   .attr('class', 'gateway-node')
    //   .attr('fill', '#f79f4b')
    //   .attr('width', d => d.w)
    //   .attr('height', d => d.h)
    //   .attr('rx', 4)
    //   .attr('ry', 4)
    //   .attr('x', d => d.x)
    //   .attr('y', d => d.y);
    // otrs.append('text')
    //   .attr('class', 'gateway-text')
    //   .attr('x', d => d.x + 15)
    //   .attr('y', d => d.y + 29)
    //   .style('fill', '#FFF')
    //   .text(d => d.name.length > 8 ? `${d.name.substring(0, 8)}..` : d.name)
    // // .on('click', (d) => {
    // //   event.stopPropagation();
    // //   event.preventDefault();
    // //   that.dispatch(ACTIONS.GATEWAY, d);
    // // });

    this.gnode = this.graph.append('g').selectAll('.node');
    this.node = this.gnode.data(this.datas.nodes)
      .enter()
      .append('g');
    // .call(d3.drag()
    //   .on('start', this.dragstart)
    //   .on('drag', this.dragged)
    //   .on('end', function(d, i) {
    //     that.tipName.show(d, this);
    //   }))

    const dragHandler = d3.drag()
      .on('start', function (d) {
        that.dragstart(d);
      })
      .on('drag', function (d) {
        that.dragged(d);
      })
      .on('end', function (d, i) {
        // that.tipName.show(d, this);
        that.dragended();
      });
    dragHandler(this.node);

    // const drag = d3.drag()
    //   .on("start", d => this.onStart(d))
    //   .on("drag", d => this.onDrag(d))
    //   .on("end", d => this.onEnd(d));
    // this.gwnode.call(drag);

    // const dragHandler2 = d3.drag()
    //   .on('start', function (d) {
    //     that.dragstart(d);
    //   })
    //   .on('drag', function (d) {
    //     that.dragged(d);
    //   })
    //   .on('end', function (d, i) {
    //     // that.tipName.show(d, this);
    //     that.dragended();
    //   });
    dragHandler(this.node);

    this.node
      .append('rect')
      .attr('class', 'traffic-node-bg')
      .attr('x', -10)
      .attr('y', 0)
      .attr('width', 160 + 20)
      .attr('height', (d) => {
        const h = 10 + d.versions.length * 40 + d.versions.length * 10;
        return h < 80 ? 80 : h;
      })
      .attr('rx', 4)
      .attr('ry', 4)
      .style('fill', '#DDD');

    this.node
      .append('image')
      .attr('width', 50)
      .attr('height', 50)
      .attr('x', 2)
      .attr('y', 10)
      .style('cursor', 'pointer')
      .attr('xlink:href', d => {
        // const type = d.type;
        // if (isNumber(d.sla) && d.sla < 100) {
        //   return RES.CUBEERROR;
        // }
        return RES.CUBE;
      })
      .on('mouseover', function (d, i) {
        that.tipName.show(d, this);
      })
      .on('mouseout', function (d, i) {
        that.tipName.hide(d, this);
      })
      .on('click', function (d, i) {
        event.stopPropagation();
        that.tip.hide({}, this);
        that.node.attr('class', '');
        d3.select(this).attr('class', 'node-active');
        // const copyD = JSON.parse(JSON.stringify(d));
        // delete copyD.x;
        // delete copyD.y;
        // delete copyD.vx;
        // delete copyD.vy;
        // delete copyD.fx;
        // delete copyD.fy;
        // delete copyD.index;
        // that.$store.commit('rocketTopo/SET_NODE', copyD);
        const copyD = { // ...
          id: d.id,
          name: d.name,
          versions: d.versions.map(v => ({ id: v.id, name: v.name }))
        };

        that.dispatch(ACTIONS.SERVICE, copyD);
        // that.toggleNode(that.node, d, true);
        // that.toggleLine(that.line, d, true);
        // that.toggleLine(that.lineNode, d, true);
      });
    this.node
      .append('text')
      .attr('class', 'node-text')
      .attr('text-anchor', 'middle')
      .attr('x', 22)
      .attr('y', 70)
      .style('fill', '#444')
      .text(d => d.name.length > 8 ? `${d.name.substring(0, 8)}..` : d.name);

    this.vnode = this.node.append('g')
      .attr('class', 'vnode')
      .selectAll('.vnode')
      .data((d, i) => d.versions)
      .enter();

    const vn = this.vnode
      .append('rect')
      // .attr('class', 'node-text')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('x', d => {
        const x = 10 + 90;
        d.x = x;
        return x;
      })
      .attr('y', (d, i) => {
        const y = 10 + 40 * i + 10 * i;
        d.y = y;
        return y
      })
      .attr('width', 60)
      .attr('height', 40)
      .style('fill', '#CCC')
      .on('mouseover', function (d, i) {
        that.gwtipName.show(d, this);
      })
      .on('mouseout', function (d, i) {
        that.gwtipName.hide(d, this);
      })
      .attr('cursor', 'pointer')
      .on('click', function (d, i) {
        event.stopPropagation();
        that.tip.hide({}, this);
        that.node.attr('class', '');
        d3.select(this).attr('class', 'node-active');
        const copyD = { // ...
          id: d.id,
          name: d.name,
          servName: d.parent.name
        };

        that.dispatch(ACTIONS.VERSION, copyD);
        // that.toggleNode(that.node, d, true);
        // that.toggleLine(that.line, d, true);
        // that.toggleLine(that.lineNode, d, true);
      });

    this.vnode
      .append('text')
      .attr('class', 'node-text')
      // .attr('text-anchor', 'middle')
      .attr('x', (d) => {
        const x = 5 + 100;
        d.x = x;
        return x;
      })
      .attr('y', (d, i) => {
        const y = 10 + 40 * i + 10 * i + 24;
        d.y = y;
        return y;
      })
      .style('fill', '#444')
      .text(d => d.name.length > 6 ? `${d.name.substring(0, 6)}..` : d.name);

    // this.vnode
    //   .append('path')
    //   // .attr('class', 'node-text')
    //   // .attr('text-anchor', 'middle')
    //   .attr('d', (d, i) => {
    //     return `M 47 30 L ${8 + 90} ${5 + 40 * i + 10 * i + 25}`
    //   })
    //   .attr('stroke', '#7A7A7A55')
    //   .attr('stroke-width', '1.5')
    //   .attr('fill', 'none');

    this.glink = this.graph.append('g').selectAll('.link');
    this.link = this.glink.data(this.datas.calls).enter();
    this.line = this.link.append('path')
      .attr('class', 'link')
      .attr('stroke-dasharray', '13 7')
      .attr('stroke-width', '1.5')
      .style('fill', 'none')
      .style('animation', 'dash 1s linear infinite')
      .attr('stroke', d => this.getLineColor(d.traffic));
    const handleSelectLine = function (d, i) {
      that.tip.hide({}, this);
    };
    // this.lineNode = this.link.append('rect')
    //   .attr('class', 'link-node cp')
    //   .attr('x', -15)
    //   .attr('y', -8)
    //   .attr('width', d => d.type === 'service' ? 0 : 30)
    //   .attr('height', d => d.type === 'service' ? 0 : 16)
    //   // .attr('rx', d => d.type === 'service' ? 0 : 8)
    //   // .attr('ry', d => d.type === 'service' ? 0 : 8)
    //   .attr('stroke', d => this.getRateColor(d.rate))
    //   .attr('stroke-width', d.type === 'service' ? 0 : 1.5)
    //   .attr('fill', '#BBB')
    //   .on('click', function (d, i) {
    //     // that.dispatch(ACTIONS.SET_NODE_LINE, d);
    //     // that.$store.commit('rocketTopo/SET_MODE', d.detectPoint === 'SERVER');
    //     event.stopPropagation();
    //     that.tip.hide({}, this);
    //     that.tip.show(d, this);
    //     // that.$store.dispatch(that.$store.state.rocketTopo.mode ? 'rocketTopo/GET_TOPO_SERVICE_INFO' : 'rocketTopo/GET_TOPO_CLIENT_INFO', {
    //     //   id: d.id,
    //     //   duration: that.$store.getters.durationTime
    //     // });
    //     // that.$store.commit('rocketTopo/SET_CALLBACK', function() {
    //     //   that.tip.hide({}, this);
    //     //   that.tip.show(d, this);
    //     //   that.$store.dispatch(that.$store.state.rocketTopo.mode ? 'rocketTopo/GET_TOPO_SERVICE_INFO' : 'rocketTopo/GET_TOPO_CLIENT_INFO', {
    //     //     id: d.id,
    //     //     duration: that.$store.getters.durationTime
    //     //   });
    //     // });
    //   });

    this.lineText = this.link.append('text')
      .attr('class', 'rate-line-text')
      .attr('y', 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11')
      .attr('cursor', 'pointer')
      .attr('fill', '#444')
      .text(d => this.getRate(d.traffic))
      .on("mouseover", function (d) {
        d3.select(this).attr("font-size", '14');
      })
      .on("mouseout", function (d) {
        d3.select(this).attr("font-size", '11');
      })
      .on('click', (d, i) => {
        event.stopPropagation();
        event.preventDefault();
        that.dispatch(ACTIONS.LINE, d);
        // this.$store.commit('rocketTopo/SET_NODE', {});
        // this.$store.dispatch('rocketTopo/CLEAR_TOPO_INFO');
        that.tip.hide({}, this);
        // this.toggleNode(this.node, d, false);
        // this.toggleLine(this.line, d, false);
        // this.toggleLine(this.lineNode, d, false);
      });

    d3.timeout(() => {
      // do not confused with this algorithm, just follow the official doc:
      // see https://github.com/d3/d3-force#simulation_tick
      for (
        let i = 0,
        n = Math.ceil(
          Math.log(this.force.alphaMin()) /
          Math.log(1 - this.force.alphaDecay())
        );
        i < n;
        i += 1
      ) {
        if (this.coordSetting.coords) {
          this.datas.nodes.forEach((n, i) => {
            const saved = this.coordSetting.coords.find(s => s.id === n.id);
            if (saved) {
              n.x = saved.x;
              n.y = saved.y;
            } else {

            }
          });
        }

        if (this.coordSetting.scale) {
          const { tx, ty, s } = this.coordSetting.scale;
          this.graph.attr(
            'transform',
            `translate(${tx},${ty})scale(${s})`
          );
        }

        if (!this.hasSavedCoor()) {
          this.force.tick();
        }
        this.tick();
      }
    });
  }

  getRate(traffic) {
    const error = +traffic.errorPercent;
    const success = +traffic.successPercent;
    const reqPercent = +traffic.reqPercent;
    if (traffic.type === 'tcp') {
      return 'tcp';
    } else {
      return (error + success > 0) ? traffic.type + ' ' + reqPercent + '%' : '';
    }
  }

  getLineColor(traffic) {
    const error = +traffic.errorPercent;
    const success = +traffic.successPercent;

    if (traffic.type === 'tcp') {
      return '#217EF2';
    } else {
      if (error + success > 0) {
        return error < 1 ? 'green' : error < 20 ? '#FFAB2B' : '#B70000';
      } else {
        return '#8D8D8D';
      }
    }
  }

  isLinkNode(currNode, node) {
    if (currNode.id === node.id) {
      return true;
    }
    return this.datas.calls.filter(i =>
      (i.source.id === currNode.id || i.target.id === currNode.id) &&
      (i.source.id === node.id || i.target.id === node.id)
    ).length;
  }

  toggleNode(nodeCircle, currNode, isHover) {
    if (isHover) {
      // 提升节点层级
      nodeCircle.sort((a, b) => a.id === currNode.id ? 1 : -1);
      nodeCircle
        .style('opacity', .2)
        .filter(node => this.isLinkNode(currNode, node))
        .style('opacity', 1);
    } else {
      nodeCircle.style('opacity', 1);
    }
  }

  toggleLine(linkLine, currNode, isHover) {
    if (isHover) {
      linkLine
        .style('opacity', .05)
        .style('animation', 'none')
        .filter(link => this.isLinkLine(currNode, link))
        .style('opacity', 1)
        .style('animation', 'dash 1s linear infinite');
      // .classed('link-active', true);
    } else {
      linkLine
        .style('opacity', 1)
        .style('animation', 'dash 1s linear infinite');
      // .classed('link-active', false);
    }
  }

  isLinkLine(node, link) {
    return link.source.id == node.id || link.target.id == node.id;
  }

  toggleLineText(lineText, currNode, isHover) {
    if (isHover) {
      lineText
        .style('fill-opacity', link => this.isLinkLine(currNode, link) ? 1.0 : 0.0);
    } else {
      lineText
        .style('fill-opacity', '1.0');
    }
  }

  toggleMarker(marker, currNode, isHover) {
    if (isHover) {
      marker.filter(link => this.isLinkLine(currNode, link))
        .style('transform', 'scale(1.5)');
    } else {
      marker
        // .attr('refX', nodeConf.radius.Company)
        .style('transform', 'scale(1)');
    }
  }

  resize() {
    this.svg.attr('height', document.body.clientHeight - 50);
  }

  tick() {
    if (!(this instanceof TrafficGraphComponent)) {
      return;
    }

    this.line
      .attr('d', d => {
        const { sx, sy, tx, ty } = this.getLineCoord(d);
        return `M${sx} ${sy}  L${tx} ${ty}`;
      });
    // this.lineNode.attr('transform', d => {
    //   const {sx, sy, tx, ty} = this.getLineCoord(d);
    //   return `translate(${(sx + tx) / 2},${(sy + ty) / 2})`;
    // });
    this.lineText.attr('transform', d => {
      const { sx, sy, tx, ty } = this.getLineCoord(d);
      return `translate(${(sx + tx) / 2},${(sy + ty) / 2})`;
    });
    this.node.attr('transform', d => `translate(${d.x - 22},${d.y - 22})`);
    // this.gwnode.attr('transform', d => `translate(${d.x - 22},${d.y - 22})`);
  }

  getLineCoord(d) {
    let sx = d.source.x;
    let sy = d.source.y;
    let tx = d.target.x;
    let ty = d.target.y;
    if (d.type === 'gateway') {
      sx += 100;
      sy += 25;
    } else if (d.type === 'service') {
      sx += 24;
      sy += 9;
      tx += (d.target.parent.x - 32);
      ty += (d.target.parent.y - 25);
    } else if (d.type === 'version') {
      sx += (d.source.parent.x + 28);
      sy += (d.source.parent.y - 26);
    }

    return { sx, sy, tx, ty };
  }

  getZoomBehavior(g) {
    const that = this;

    return d3
      .zoom()
      .scaleExtent([0.3, 10])
      .on('zoom', (e) => {
        that.tip.hide({}, this);
        that.tipName.hide({}, this);
        g.attr(
          'transform',
          `translate(${d3.event.transform.x},${d3.event.transform.y})scale(${
          d3.event.transform.k
          })`
        );

        this.coordSetting.scale = {
          tx: d3.event.transform.x,
          ty: d3.event.transform.y,
          s: d3.event.transform.k
        };
        this.saveCoordSettings();
      });
  }

  dragstart(d) {
    this.gwtipName.hide({});
    this.tipName.hide({});
    this.node._groups[0].forEach(d => {
      d.__data__.fx = d.__data__.x;
      d.__data__.fy = d.__data__.y;
    });
    if (!d3.event.active) {
      this.force.alphaTarget(0.01).restart();
    }
    d3.event.sourceEvent.stopPropagation();
  }

  dragged(d) {
    this.gwtipName.hide({});
    this.tipName.hide({});
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended() {
    if (!d3.event.active) {
      this.force.alphaTarget(0);
    }

    this.coordSetting.coords = this.datas.nodes.map(n => ({
      id: n.id,
      x: n.x,
      y: n.y
    }));
    this.saveCoordSettings();
  }

  // onStart(d) {
  //   this.gwtipName.hide({});
  //   this.tipName.hide({});
  //   // d3.select(this).raise().classed("active", true);
  //   if (!d3.event.active) {
  //     this.force.alphaTarget(0.01).restart();
  //   }
  //   d3.event.sourceEvent.stopPropagation();
  // }
  //
  // onDrag(d) {
  //   this.gwtipName.hide({});
  //   this.tipName.hide({});
  //   d.x = d3.event.x;
  //   d.y = d3.event.y;
  // }
  //
  // onEnd(d) {
  //   // d3.select(this).classed("active", false);
  //   if (!d3.event.active) {
  //     this.force.alphaTarget(0);
  //   }
  // }

  dispatch(action: ACTIONS, value?: any) {
    const data = { action, obj: value };
    this.onSelect$.emit(data);
  }

  hasSavedCoor() {
    return !!this.coordSetting.coords;
  }

  saveCoordSettings() {
    const settings = this.loadAllCoordSettings();
    settings[this.projectCode] = this.coordSetting;
    localStorage.setItem('traffic-topo-graph-cord-s', JSON.stringify(settings));
  }

  loadAllCoordSettings() {
    return JSON.parse(localStorage.getItem('traffic-topo-graph-cord-s')) || {};
  }
}

const RES = {
  LOCAL: 'assets/topo/Local2.png',
  CUBE: 'assets/topo/cube22.png',
  CUBEERROR: 'assets/topo/cube21.png',
  USER: 'assets/topo/USER.png',
  UNKNOWN: 'assets/topo/UNKNOWN.png',
  UNKNOWNCLOUD: 'assets/topo/UNKNOWN_CLOUD.png',
  UNDEFINED: 'assets/topo/UNDEFINED.png',
  KAFKA: 'assets/topo/KAFKALOGO.png',
  KAFKACONSUMER: 'assets/topo/KAFKALOGO.png',
  H2: 'assets/topo/H2.png',
  REDIS: 'assets/topo/REDIS.png',
  TOMCAT: 'assets/topo/TOMCAT.png',
  HTTPCLIENT: 'assets/topo/HTTPCLIENT.png',
  DUBBO: 'assets/topo/DUBBO.png',
  MOTAN: 'assets/topo/MOTAN.png',
  RESIN: 'assets/topo/RESIN.png',
  OKHTTP: 'assets/topo/OKHTTP.png',
  SPRINGMVC: 'assets/topo/SPRINGMVC.png',
  STRUTS2: 'assets/topo/STRUTS2.png',
  NUTZMVC: 'assets/topo/SPRINGMVC.png',
  NUTZHTTP: 'assets/topo/HTTPCLIENT.png',
  JETTY: 'assets/topo/JETTY.png',
  JETTYSERVER: 'assets/topo/JETTYSERVER.png',
  GRPC: 'assets/topo/GRPC.png',
  ORACLE: 'assets/topo/ORACLE.png',
  MYSQL: 'assets/topo/MYSQL.png',
  MYSQLGROUP: 'assets/topo/MYSQL.png',
  MSSQLSERVER: 'assets/topo/MYSQL.png',
  MSSQLSERVERGROUP: 'assets/topo/MYSQL.png',
  MONGODB: 'assets/topo/MONGODB.png',
  MONGODBGROUP: 'assets/topo/MONGODB.png',
  ACTIVEMQ: 'assets/topo/ACTIVEMQ.png',
  ELASTICSEARCH: 'assets/topo/ELASTICSEARCH.png',
  FEIGNDEFAULTHTTP: 'assets/topo/FEIGNDEFAULTHTTP.png',
  HPROSE: 'assets/topo/HPROSE.png',
  // HPROSE: 'assets/topo/POSTGRESQL.png',
  RABBITMQ: 'assets/topo/RABBITMQ.png',
  SOFARPC: 'assets/topo/SOFARPC.png',
  ROCKETMQ: 'assets/topo/ROCKETMQ.png',
  HTTP: 'assets/topo/HTTPCLIENT.png',
};

class CoordSetting {
  scale: { tx: number, ty: number, s: number };
  coords: { id: string, x: number, y: number }[];
}
