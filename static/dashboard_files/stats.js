var count,timeline,chart,pie,piechart,devhist,devhistchart,list,map,datatable;var stats_update_interval=(slowBrowser())?10:5;if(!txt_dir){var txt_dir="ltr"}if(!tx_num_thou){var tx_num_thou=","}if(!tx_num_dec){var tx_num_dec="."}window.addEvent("domready",function(){$("bigarrow").set("html",(txt_dir=="rtl")?"&larr;":"&rarr;");if(txt_dir=="rtl"){$("dashtitle").setStyle("direction","rtl")}var a=new Element("img",{src:"http://assets.amung.us/images/stats/face.png"});a.inject($("dashtitle"),"bottom")});var Poller=new Class({initialize:function(c,a,b){this.view=a;this.first_update=true;this.timeline="hourly";this.show_table=false;this.pins_exist=false;if(typeof b!="undefined"){this.list_link_target=b}else{this.list_link_target="_self"}count=new Count();if(this.view=="dashboard"){this.req={k:c,timeline:this.timeline,list:"grouped",pins:"old",dev:1};this.show_table=false;timeline=new Highchart(this.timeline,false);list=new List("pages",this.list_link_target);map=new Map("dashmap");pie=new HighchartPie();devhist=new DeviceHistChart()}else{if(this.view=="readers"){this.req={k:c,list:"recents",max:1};list=new List("recents",this.list_link_target)}else{if(this.view=="maps"){this.req={k:c,pins:"old"};map=new Map("bigmap")}else{if(this.view=="history"){this.req={k:c,timeline:this.timeline};this.show_table=true;timeline=new Highchart(this.timeline,true);datatable=new Datatable(this.timeline)}else{if(this.view=="wibiya"){this.req={k:c,list:"grouped",pins:"old"};list=new List("pages",this.list_link_target);map=new Map("dashmap")}else{if(this.view=="wibiyamaps"){this.req={k:c,pins:"old"};map=new Map("wibiyabigmap")}}}}}}this.get_data();(function(){this.get_data()}.bind(this)).periodical(stats_update_interval*1000)},get_data:function(){this.jsonRequest=new Request.JSON({url:"/stats/data/",noCache:true,link:"cancel",onSuccess:function(b){count.update(b.total_count);if(this.view=="dashboard"||this.view=="history"){if(b.timeline){if(b.timeline.length<1&&parseInt(b.total_count)<1){$("no_data_history").fade((slowBrowser())?"show":"in")}else{$("no_data_history").fade((slowBrowser())?"hide":"out")}}var a=new Date();if(a.getMinutes()==0&&a.getSeconds()<=stats_update_interval){this.req.timeline=this.timeline}if(b.last_hour>=0&&typeof b.timeline!="undefined"){b.timeline.push(b.last_hour)}if(b.timeline&&this.first_update){timeline.update(b.timeline,b.total_count);this.req.timeline=""}else{if(b.timeline&&!this.first_update){chart.destroy();timeline=new Highchart(this.req.timeline,this.show_table);timeline.update(b.timeline,b.total_count);this.req.timeline=""}}timeline.update_now(b.total_count);this.req.dev=""}if(this.view=="dashboard"||this.view=="readers"||this.view=="wibiya"){if(b.pages.length<1){$("no_data_list").fade((slowBrowser())?"show":"in")}else{$("no_data_list").fade((slowBrowser())?"hide":"out")}list.update(b)}if(this.view=="dashboard"||this.view=="maps"||this.view=="wibiyamaps"||this.view=="wibiya"){if(b.pins){if(b.pins.length<1&&!this.pins_exist){$("no_data_map").fade((slowBrowser())?"show":"in")}else{$("no_data_map").fade((slowBrowser())?"hide":"out");this.pins_exist=true}}if(this.req.pins){map.update(b.pins,this.req.pins)}if(this.req.pins=="old"){this.req.pins="new"}}if(this.first_update){$$(".wau_loader").fade((slowBrowser())?"hide":0);this.first_update=false;if(this.view=="dashboard"){pie.update(b.dev,true);devhist.update(b)}}}.bind(this)}).get(this.req)},change_list:function(a){this.show_loader();this.req.list=a;list=new List(a,this.list_link_target);this.get_data()},show_pins:function(){this.show_loader();this.req.pins="old";map.show_pins();this.get_data()},show_heatmap:function(){this.show_loader();this.req.pins="";map.show_heatmap()},change_timeline:function(a){this.show_loader();chart.destroy();this.req.timeline=this.timeline=a;timeline=new Highchart(a,this.show_table);this.get_data()},show_loader:function(){$$(".wau_loader").fade((slowBrowser())?"show":0.8);this.first_update=true;this.jsonRequest.cancel()},which_view:function(){return this.view}});var Count=new Class({update:function(d){var a=d;var f=$("totalusers");if(f.get("html").replace(",","")!=a){if(!slowBrowser()){var c=new Fx.Tween(f);c.start("opacity",0.5).chain(function(){f.set("html",parseInt(a).format({group:tx_num_thou}));c.start("opacity",1)});var b=(parseInt(a)>parseInt(f.get("html").replace(",","")))?"#399834":"#983434";var e=new Fx.Tween(f);e.start("color",b).chain(function(){e.start("color","#333")})}else{f.set("html",parseInt(a).format({group:tx_num_thou}))}}}});var Highchart=new Class({initialize:function(h,k){this.type=h;this.xaxis=new Array();this.counts_min=new Array();this.counts_avg=new Array();this.counts_max=new Array();this.show_table=k;this.style={fontFamily:'"Monaco","Consolas","DejaVu Sans Mono",monospace',fontSize:"12px",letterSpacing:"-1px"};var a=new Date();var g=new Array(12);g[0]="Jan";g[1]="Feb";g[2]="Mar";g[3]="Apr";g[4]="May";g[5]="Jun";g[6]="Jul";g[7]="Aug";g[8]="Sep";g[9]="Oct";g[10]="Nov";g[11]="Dec";if(this.type=="hourly"){var b=24;var d=a.getHours();this.scope="hour"}if(this.type=="daily"){var b=31;var d=a.getDate();this.scope="day";var f=(a.getMonth()==0)?11:a.getMonth()-1;var j=(a.getMonth()==0)?a.getYear()-1:a.getYear();this.days_last_month=32-new Date(j,f,32).getDate()}if(this.type=="monthly"){var b=12;var d=(a.getMonth()<10)?a.getMonth()+1:0;this.scope="month"}for(var e=0;e<b;e++){this.xaxis.push(((this.type=="monthly")?g[e]:((this.type=="daily")?e+1:e))+((this.type=="hourly")?"h":""));this.counts_min.push(0);this.counts_avg.push(0);this.counts_max.push(0)}if(this.type!="daily"){this.xaxis=this.xaxis.slice(d).concat(this.xaxis.slice(0,d))}else{this.xaxis=this.xaxis.slice(d,this.days_last_month).concat(this.xaxis.slice(0,d))}var c={chart:{renderTo:"chart",animation:false,defaultSeriesType:"areaspline",backgroundColor:"",margin:[30,0,25,50],events:{},width:$("chart").getSize().x},title:{text:""},legend:{align:"right",verticalAlign:"top",y:-10,itemStyle:{cursor:"pointer"},borderWidth:1,backgroundColor:"#FFFFFF",itemStyle:this.style},xAxis:{id:"xaxis",labels:{style:this.style}},yAxis:{title:{text:""},labels:{style:this.style,formatter:function(){return Highcharts.numberFormat(this.value,0,tx_num_dec,tx_num_thou)}},endOnTick:false},tooltip:{style:this.style,snap:2,formatter:function(){return Highcharts.numberFormat(this.y,0,tx_num_dec,tx_num_thou)+" "+$("chart_users").get("html")}},credits:{enabled:false},plotOptions:{areaspline:{fillOpacity:0.8,marker:{enabled:true,symbol:"circle",radius:0,states:{hover:{enabled:true,radius:6,lineWidth:0}}}}},series:[{id:"counts_max",name:"Max",color:"#ff9007"},{id:"counts_avg",name:"Avg",color:"#75c142"},{id:"counts_min",name:"Min",color:"#3597db"}]};if(window.location.href.indexOf("/stats/history/")<0){c.chart.events={click:function(i){window.location="http://whos.amung.us/stats/history/"+sitekey+"/"}};c.chart.style={cursor:"pointer"};c.plotOptions.areaspline.events={click:function(i){window.location="http://whos.amung.us/stats/history/"+sitekey+"/"}}}chart=new Highcharts.Chart(c)},update:function(e,d){var a=0;if(this.type=="hourly"){var h=parseInt(e.pop())+1;var i=0}else{if(this.type=="daily"){var h=new Date().getDate();var i=1}else{if(this.type=="monthly"){var h=new Date().getMonth()+1;var i=1}}}if(this.scope){e.each(function(c){this.counts_min[parseInt(c[this.scope])-i]=parseInt(c.count_min);this.counts_avg[parseInt(c[this.scope])-i]=parseInt(c.count_avg);this.counts_max[parseInt(c[this.scope])-i]=parseInt(c.count_max)}.bind(this))}if(this.type=="daily"){this.counts_min=this.counts_min.slice(h,this.days_last_month).concat(this.counts_min.slice(0,h));this.counts_avg=this.counts_avg.slice(h,this.days_last_month).concat(this.counts_avg.slice(0,h));this.counts_max=this.counts_max.slice(h,this.days_last_month).concat(this.counts_max.slice(0,h))}else{this.counts_min=this.counts_min.slice(h).concat(this.counts_min.slice(0,h));this.counts_avg=this.counts_avg.slice(h).concat(this.counts_avg.slice(0,h));this.counts_max=this.counts_max.slice(h).concat(this.counts_max.slice(0,h))}if(this.type=="yearly"){e.pop();var g;e.each(function(c){g=c.year;this.xaxis.push(c.year);this.counts_min.push(parseInt(c.count_min));this.counts_avg.push(parseInt(c.count_avg));this.counts_max.push(parseInt(c.count_max))}.bind(this));this.xaxis.push(g-1);this.counts_min.push(0);this.counts_avg.push(0);this.counts_max.push(0);this.xaxis.reverse();this.counts_min.reverse();this.counts_avg.reverse();this.counts_max.reverse()}this.xaxis.push($("chart_now").get("html"));chart.get("xaxis").setCategories(this.xaxis,false);chart.get("counts_max").setData(this.counts_max,false);chart.get("counts_avg").setData(this.counts_avg,false);chart.get("counts_min").setData(this.counts_min,false);chart.get("counts_avg").addPoint({id:"now",y:1,marker:{fillColor:"#ffffff",lineColor:"#75c142",lineWidth:4,radius:10}},false);var f=2;var b=Math.max.apply(0,this.counts_max);if(parseInt(d)>b){b=parseInt(d)}if(b<=1){b=f}b=Math.floor(b*1.05);if(b%2!=0){b=b+1}chart.yAxis[0].options.max=b;chart.yAxis[0].options.tickInterval=Math.round(b/f);if(!slowBrowser()){chart.redraw()}if(this.show_table){datatable.render_table(this.counts_max,this.counts_avg,this.counts_min,this.xaxis)}},update_now:function(b){var a=Math.max.apply(0,this.counts_max);if(parseInt(b)>a){a=parseInt(b)}(function(){var c=2;if(a<=1){a=c}a=Math.floor(a*1.05);if(a%2!=0){a=a+1}chart.yAxis[0].options.max=a;chart.yAxis[0].options.tickInterval=Math.round(a/c);chart.get("now").update(parseInt(b))}).delay(1000)}});var DeviceHistChart=new Class({initialize:function(){this.style={fontFamily:'"Monaco","Consolas","DejaVu Sans Mono",monospace',fontSize:"12px",letterSpacing:"-1px"};var a={chart:{renderTo:"devhistchart",animation:false,defaultSeriesType:"spline",backgroundColor:"",events:{},width:420,height:80},title:{text:""},legend:{enabled:false},xAxis:{id:"xaxis",labels:{style:this.style}},yAxis:{title:{text:""},labels:{enabled:false},endOnTick:false},tooltip:{style:this.style,snap:2,formatter:function(){return(24-parseInt(this.point.x))+"hrs ago: "+Highcharts.numberFormat(this.y,0,tx_num_dec,tx_num_thou)+"% "+this.series.name}},credits:{enabled:false},plotOptions:{spline:{fillOpacity:0.8,marker:{enabled:false,}},series:{point:{events:{mouseOver:function(){if(typeof pie!="undefined"){var b={};if(this.series.chart.series[2].data[this.x].y>0){b.Tablet=this.series.chart.series[2].data[this.x].y}if(this.series.chart.series[1].data[this.x].y>0){b.Phone=this.series.chart.series[1].data[this.x].y}if(this.series.chart.series[0].data[this.x].y>0){b.Desktop=this.series.chart.series[0].data[this.x].y}pie.update(b,false)}},mouseOut:function(){if(typeof pie!="undefined"){pie.snapOut()}}}}}},series:[{id:"dev_desktop",name:"Desktop",color:"#3597db"},{id:"dev_phone",name:"Phone",color:"#75c142"},{id:"dev_tablet",name:"Tablet",color:"#ff9007"}],};devhistchart=new Highcharts.Chart(a)},update:function(f){var a=new Array();var b=new Array();var h=new Array();var e=new Array();var g=f.last_hour+1;for(var d=0;d<24;d++){e.push("");a.push(0);b.push(0);h.push(0)}for(var c in f.devhist){a[f.devhist[c]["hour"]]=(typeof f.devhist[c]["Desktop"]!="undefined")?f.devhist[c]["Desktop"]:0;b[f.devhist[c]["hour"]]=(typeof f.devhist[c]["Phone"]!="undefined")?f.devhist[c]["Phone"]:0;h[f.devhist[c]["hour"]]=(typeof f.devhist[c]["Tablet"]!="undefined")?f.devhist[c]["Tablet"]:0}a=a.slice(g).concat(a.slice(0,g));b=b.slice(g).concat(b.slice(0,g));h=h.slice(g).concat(h.slice(0,g));e=e.slice(g).concat(e.slice(0,g));devhistchart.get("xaxis").setCategories(e,false);devhistchart.get("dev_desktop").setData(a,false);devhistchart.get("dev_phone").setData(b,false);devhistchart.get("dev_tablet").setData(h,false);if(!slowBrowser()){devhistchart.redraw()}}});var HighchartPie=new Class({initialize:function(){this.counts={};this.style={fontFamily:'"Monaco","Consolas","DejaVu Sans Mono",monospace',fontSize:"12px",letterSpacing:"-1px"};var a={chart:{renderTo:"piechart",animation:false,defaultSeriesType:"pie",backgroundColor:"",events:{},width:340,height:250},title:{text:""},tooltip:{pointFormat:"<b>{point.percentage:.1f}%</b>"},credits:{enabled:false},plotOptions:{pie:{size:"70%"}},series:[{}]};piechart=new Highcharts.Chart(a)},update:function(b,c){if(typeof b=="undefined"||Object.keys(b).length===0||b.length<=0){b={Unknown:100}}if(c||typeof c=="undefined"){this.counts=b}var d=new Array();for(var a in b){if(a=="Desktop"&&b.Desktop>0){d.push({name:"Desktop",color:"#3597db",sliced:true,selected:true,y:b.Desktop})}else{if(a=="Tablet"&&b.Tablet>0){d.push({name:"Tablet",color:"#ff9007",y:b.Tablet})}else{if(a=="Phone"&&b.Phone>0){d.push({name:"Phone",color:"#75c142",y:b.Phone})}else{if(a=="Unknown"&&b.Unknown){d.push({name:"Unknown",color:"#cccccc",y:b.Unknown})}}}}}piechart.series[0].setData(d);piechart.redraw()},snapOut:function(){this.update(this.counts)}});var Datatable=new Class({initialize:function(c){this.type=c;var e=new Element("div",{html:"&darr; Data &darr;",id:"datatablehandle"});var d=new Element("div",{"class":"clear",id:"datatabledata"});var b=$("datatablecontainer");b.empty();e.inject(b);d.inject(b);var a={"true":"&uarr; Data &uarr;","false":"&darr; Data &darr;"};this.data_slide=new Fx.Slide(d).hide();var f=this.data_slide;e.addEvent("click",function(g){g.stop();f.toggle()});this.data_slide.addEvent("complete",function(g){$("datatablehandle").set("html",a[f.open])})},render_table:function(p,l,h,m){var q=new Element("table");var f=new Element("tr");var o=new Element("th",{html:"-"});var g=new Element("th",{html:"Max"});var c=new Element("th",{html:"Avg"});var b=new Element("th",{html:"Min"});o.inject(f);g.inject(f);c.inject(f);b.inject(f);f.inject(q);for(var d=0;d<p.length;d++){var r=new Element("tr");var k=new Element("td",{html:m[d],"class":"strong"});var n=new Element("td",{html:Highcharts.numberFormat(p[d],0,tx_num_dec,tx_num_thou)});var j=new Element("td",{html:Highcharts.numberFormat(l[d],0,tx_num_dec,tx_num_thou)});var e=new Element("td",{html:Highcharts.numberFormat(h[d],0,tx_num_dec,tx_num_thou)});k.inject(r);n.inject(r);j.inject(r);e.inject(r);r.inject(q)}var a=$("datatabledata");a.empty();q.inject(a);if(this.data_slide.open){this.data_slide.show()}}});var List=new Class({initialize:function(b,a){this.link_target=a;$("listcontainer").empty();var d=new Element("div",{id:"list"});var c=$("listcontainer");d.inject(c);this.type=b;this.itempos=new Array();this.new_list=true;this.vert,this.total;this.iurl="http://assets.amung.us/images/list/";if(b=="recents"){this.recents=true}},update:function(b){var a=$("list").getChildren().length;var c=0;var e=b.pages.length;this.itemtmr=0;if(a){this.purge_list();this.new_list=false}else{this.new_list=true}if(this.recents){b.pages.reverse()}this.total=b.total_count;if(e>5){$("listcontainer").setStyle("height",e*44);$("list").setStyle("height",e*44*3)}b.pages.each(function(m){var l=m.title;l=!l?m.url:l;var j=parseInt(m.count);this.itempos.push(m.id);if($(m.id)){var o=$(m.id).getFirst();var g=(this.recents)?Math.floor(j/60)+":"+((j%60<10)?"0"+j%60:j%60):j.format({group:tx_num_thou});if(o.get("html")!=g){if(!slowBrowser()){var n=new Fx.Tween(o);n.start("opacity",0.5).chain(function(){o.set("html",g);n.start("opacity",1)});if(!this.recents){var h=(j>parseInt(o.get("html").replace(",","")))?"#399834":"#983434";var i=new Fx.Tween(o);i.start("color",h).chain(function(){i.start("color","#333")})}}else{o.set("html",g)}}if(!this.recents){var k=$$("#"+m.id+" .detailholder");k[0].empty();(this.update_stars((j/this.total*100).format({decimals:1}))).inject(k[0])}if(this.recents){var f=$$("#"+m.id+" .titlehref");if(f.getProperty("href")!=m.url){f.setProperty("href",m.url);f.set("html",l);f.addEvent("mouseover",function(){f.set("html",m.url)});f.addEvent("mouseleave",function(){f.set("html",l)})}}}else{this.create_row(m);c++}}.bind(this));if(a){this.hide_entries()}if(this.recents){if(!slowBrowser()){$("listcontainer").scrollTo(0,c*44);var d=new Fx.Scroll("listcontainer",{link:"cancel",duration:1000,fps:120,wheelStops:false,transition:Fx.Transitions.Back.easeInOut});d.toTop().chain(function(){this.purge_list();this.sort_list()}.bind(this))}else{this.purge_list();this.sort_list()}}else{this.sort_list()}},create_row:function(l){var j=l.title;j=!j?l.url:j;var g=parseInt(l.count);j=j.length>75?j.substring(0,70)+"...":j;var a="";if(Cookie.read("lp")==1||sitekey=="dzsg93pq"){a=l.url}else{a="http://whos.amung.us/exit/"+encodeURIComponent(l.url.replace(/\//g,"_wausl_"))}var b=new Element("div",{id:l.id,"class":"entry"});var h=new Element("div",{"class":"bigcount",html:(this.recents)?Math.floor(g/60)+":"+((g%60<10)?"0"+g%60:g%60):g.format({group:tx_num_thou})});if(Browser.ie&&Browser.version<9){h.setStyle("letter-spacing","-2")}var c=new Element("div",{"class":"details"});var e=new Element("div",{"class":"urltitle"});var a=new Element("a",{"class":"titlehref nu",href:a,html:j,target:this.link_target});e.addEvent("mouseover",function(){a.set("html",l.url)});e.addEvent("mouseleave",function(){a.set("html",j)});var i=new Element("div",{"class":"detailholder"});if(this.recents){var k=new Element("img",{src:"http://assets.amung.us/images/flags/16/"+l.country_code.toLowerCase()+".png"});k.setStyle("vertical-align","middle");k.setStyle("margin","-1px 3px 0 0px");var d=new Element("span",{"class":"country",html:(l.city)?l.city+", "+l.country_code:l.country_code})}var f=new Element("div",{"class":"gap",html:"&nbsp;"});a.inject(e);if(this.recents){k.inject(i);d.inject(i)}else{(this.update_stars((g/this.total*100).format({decimals:1}))).inject(i)}e.inject(c);i.inject(c);h.inject(b);c.inject(b);f.inject(b);if(!this.recents){b.fade("hide");b.inject($("list"));(function(){b.fade((slowBrowser())?"show":"in")}).delay(this.itemtmr);this.itemtmr+=100}else{b.inject($("list"),"top")}},hide_entries:function(){var a=$$("#list .entry");a.each(function(c){var b=c.get("id");if(!this.itempos.contains(b)){this.itempos.push(b);$(b).fade((slowBrowser())?"hide":"out")}}.bind(this))},purge_list:function(){var c=new Array();var a=$$("#list .entry");a.each(function(e){var d=e.get("id");if(e.getStyle("opacity")==0){$(d).setStyle("display","none");c.push(d)}}.bind(this));if(!this.vert){this.sync_list()}if(!this.new_list){try{this.vert.rearrangeDOM()}catch(b){}}while(c.length>0){$(c.pop()).destroy()}},sort_list:function(){this.sync_list();if(this.recents){this.itempos.reverse()}if(this.recents){}var a=this.itempos.map(function(b){return document.id(b)});this.vert.sortByElements($$(a));this.itempos.empty()},sync_list:function(){this.vert=new Fx.Sort($$("#list .entry"),{transition:Fx.Transitions.Back.easeInOut,duration:(slowBrowser())?1:1000,fps:(slowBrowser())?1:120})},update_stars:function(g){g=parseInt(g*10)*0.1;g=(g>100)?100:g;g=g.format({decimal:tx_num_dec,decimals:1});var f=new Element("div");var e=new Element("img",{src:this.iurl+"star-empty.png","class":"bar"});var c=new Element("img",{src:this.iurl+"star-half.png","class":"bar"});var d=new Element("img",{src:this.iurl+"star-full.png","class":"bar"});var a=new Element("span",{html:g+"%"});a.setStyle("margin-left","3px");if(g<10){e.inject(f)}else{for(var b=0;b<Math.floor(g/20);b++){d.clone().inject(f)}if(Math.floor(g/10)%2!=0){c.inject(f)}}a.inject(f);return f}});var Map=new Class({initialize:function(d){this.type=d;this.itemtmr=0;this.iurl="http://assets.amung.us/images/map/";var f=$("mapcontainer");if(d=="dashmap"){this.mapback=this.iurl+"dashmap.png";this.mapwidth=420;this.flagsize=16;this.pintipheight=35;this.pintipleft={height:25,background:"url("+this.iurl+"bubble-left.png) top left"};this.pintipright={height:25,background:"url("+this.iurl+"bubble-right.png) top left"};this.pintiptext={"font-size":12,padding:"4px 0 0 0px","line-height":16,background:"url("+this.iurl+"bubble-middle.png) no-repeat top center",height:35}}else{if(d=="bigmap"){this.mapback=this.iurl+"bigmap.jpg";this.mapwidth=1000;this.flagsize=24;this.pintipheight=45;this.pintipleft={height:32,background:"url("+this.iurl+"bubble-big-left.png) top left"};this.pintipright={height:32,background:"url("+this.iurl+"bubble-big-right.png) top left"};this.pintiptext={"font-size":14,padding:"3px 0 0 0px","line-height":24,background:"url("+this.iurl+"bubble-big-middle.png) no-repeat top center",height:45}}else{if(d=="wibiyabigmap"){this.mapback=this.iurl+"wibiyabigmap.jpg";this.mapwidth=730;this.flagsize=24;this.pintipheight=45;this.pintipleft={height:32,background:"url("+this.iurl+"bubble-big-left.png) top left"};this.pintipright={height:32,background:"url("+this.iurl+"bubble-big-right.png) top left"};this.pintiptext={"font-size":14,padding:"3px 0 0 0px","line-height":24,background:"url("+this.iurl+"bubble-big-middle.png) no-repeat top center",height:45}}}}var e=new Element("div",{id:"map-pins"});var c=new Element("div",{id:"map-tips"});var a=new Element("img",{id:"imi",src:"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",border:0,usemap:"#imagemap"});var b=document.createElement("map");b.id="imagemap";b.name="imagemap";f.setStyle("width",this.mapwidth+"px");f.setStyle("height",this.mapwidth/2+"px");f.setStyle("background-image","url("+this.mapback+")");a.setStyle("width",this.mapwidth+"px");a.setStyle("height",this.mapwidth/2+"px");c.setStyle("width",this.mapwidth+100+"px");e.inject(f);c.inject(f);a.inject(f);f.appendChild(b)},update:function(a,b){a.each(function(c){this.add_pin(c,b)}.bind(this))},convert:function(b,c){var d=((-1*b)+90)*(this.mapwidth/2/180);var a=(c+180)*(this.mapwidth/360);return{x:Math.round(a),y:Math.round(d)}},add_pin:function(b,a){var j=b.lat;var c=b.lon;var l=this.convert(j,c);var f="_p"+l.x+"x"+l.y;var e=new Date();var g=new Array(7,7,7);g[0]+=l.x-8;g[1]+=l.y-19;var n="/stats/";if(window.location.href.indexOf("/wibiya/istats/")>=0){n="/wibiya/istats/"}if(!$(f)){var d=new Element("div",{id:f});var k=new Element("area",{id:"_im"+l.x+"x"+l.y,shape:"circle",coords:g.join(","),"class":"tooltip"});if(poller.which_view()=="dashboard"||poller.which_view()=="wibiya"){k.set("href",n+"maps/"+sitekey+"/")}k.addEvent("mouseenter",function(){map.show_tooltip(f)});k.addEvent("mouseleave",function(){map.hide_tooltip(f)});if(this.type=="dashmap"){k.addEvent("click",function(){window.location="http://whos.amung.us/stats/maps/"+sitekey+"/"})}d.addClass("pin");d.setStyle("margin-left",l.x-8);if(a=="old"){d.addClass("pin-old");d.setStyle("margin-top",l.y-19);if(!slowBrowser()){d.setStyle("visibility","hidden")}}else{d.addClass("pin-new");if(!slowBrowser()){d.setStyle("opacity",0)}else{d.setStyle("margin-top",l.y-19)}}var i=new Element("div",{"class":"_ttinfo",html:(this.type=="dashmap")?((b.city)?b.city:b.country):((b.city)?b.city+", "+b.country:b.country)});i.setStyle("visibility","hidden");var m=new Element("img",{src:"http://assets.amung.us/images/flags/"+this.flagsize+"/"+b.country_code.toLowerCase()+".png"});m.setStyle("vertical-align","middle");m.setStyle("margin","-2px 2px 0 0");m.inject(i,"top");i.inject(d);k.inject($("imagemap"),"top");d.inject($("map-pins"));if(a=="new"){if(!slowBrowser()){var h=new Fx.Morph(d,{transition:Fx.Transitions.Bounce.easeOut,duration:1000,fps:120});h.start({"margin-top":l.y-19,opacity:1})}}else{if(!slowBrowser()){(function(){d.setStyle("visibility","visible")}).delay(this.itemtmr);this.itemtmr+=10}}}else{if(a=="new"){$(f).addClass("pin-new");$(f).removeClass("pin-old");var d=$(f);$(f).dispose();d.inject($("map-pins"));var k=$("_im"+l.x+"x"+l.y);$("_im"+l.x+"x"+l.y).dispose();k.inject($("imagemap"),"top")}}if(a=="new"){if(!$(f).hasClass("_timed")){$(f).addClass("_timed");(function(){$(f).addClass("pin-old");$(f).removeClass("pin-new");$(f).removeClass("_timed")}).delay(((b.time>480)?60-e.getSeconds():480-b.time+60-e.getSeconds())*1000)}}},show_tooltip:function(d){$(d).addClass("pin-sel");var b;var a=d.replace("_p","").split("x");b=new Element("div",{id:"pintip"+d,"class":"pintip"});b.setStyle("height",this.pintipheight);tl=new Element("div",{"class":"pintip-left"});tl.setStyles(this.pintipleft);tr=new Element("div",{"class":"pintip-right"});tr.setStyles(this.pintipright);var c=new Element("div",{"class":"pintip-text"});c.setStyles(this.pintiptext);c.set("html",$$("#"+d+" ._ttinfo").get("html"));tl.inject(b);c.inject(b);tr.inject(b);b.fade("hide");b.inject("map-tips");b.fade((slowBrowser())?"show":0.85);b.setStyle("margin-left",parseInt(a[0])-Math.ceil(b.getSize().x/2)-1);b.setStyle("margin-top",parseInt(a[1])-(this.type=="dashmap"?54:64))},hide_tooltip:function(a){$(a).removeClass("pin-sel");$("map-tips").empty()},show_pins:function(){var a=$("mapcontainer");a.empty();map=new Map(this.type)},show_heatmap:function(){var b=$("mapcontainer");b.empty();var a=Asset.image("http://whos.amung.us/stats/heatmap/?k="+sitekey+"&w="+this.mapwidth,{id:"heatmap",onLoad:function(){$$(".wau_loader").fade((slowBrowser())?"hide":0)}});a.inject(b)}});function gotScriptResult(c,d,i){if(c==200){$$(".tynt_loader").destroy();if(d[1].length>0&&window.pf!=true){$("tynt_words").set("html",d[0].word_count.format({group:tx_num_thou}));$("tynt_images").set("html",d[0].image_count.format({group:tx_num_thou}));$("tynt_copies").set("html",d[0].copy_count.format({group:tx_num_thou}));var g=d[2];g.each(function(l){var k=new Element("img",{src:l[1],title:l[0],width:65,height:50});k.inject($("tyntimages"))});var f=d[1];f.each(function(l,k){(function(){(function(){if(!slowBrowser()){var m=new Fx.Tween($("tyntwords"));m.start("opacity",0).chain(function(){insertTyntWords(l);m.start("opacity",1)})}else{insertTyntWords(l)}}).periodical(d[1].length*5000)}).delay(k*5000);if(k==0){insertTyntWords(l)}})}else{var h=$("tyntcontainer");h.empty();var e=new Element("img",{src:"http://assets.amung.us/images/stats/tynthook_full.png",styles:{margin:"10px 0 0 0"}});e.inject(h)}var b=new Element("div",{id:"tyntoverlay"});var j=new Element("a",{target:"_blank",href:"https://signup.tynt.com/account/whos_amung_us_sign_up/"+sitekey});var a=new Element("img",{src:"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="});if(d[1].length<=0){b.setStyle("height",200)}a.inject(j);j.inject(b);b.inject($("tyntcontainer"))}}function insertTyntWords(d){var c=$("tyntwords");var a=new Element("span",{"class":"leftquote"});var b=new Element("span",{"class":"rightquote"});var e=new Element("span");a.set("html","&#8220;");b.set("html","&#8221;");e.set("html",(d[0]+" &raquo; "+d[1]).substr(0,90));c.empty();a.inject(c);e.inject(c);b.inject(c)}function initStatsNav(b){var a=new Element("div",{id:"statsnavline"});a.setStyle("margin-left",(b.length-4)*48+18);a.inject($("statsnavbuttons"),"before");if(!slowBrowser()){var c=new Fx.Morph("arrow",{duration:250,fps:120,transition:Fx.Transitions.Quint.easeInOut});c.start({"margin-left":12})}else{$("arrow").setStyle("margin-left",12)}$("statsnavbuttons").addEvent("mouseleave",function(){$$("#statsnavbuttons .navbutton").each(function(d){if(!slowBrowser()){c.start({"margin-left":statsnavpos*48+12});$("statsnavbuttons").getChildren()[statsnavpos].setStyle("opacity",1)}else{$("arrow").setStyle("margin-left",statsnavpos*48+12)}})});b.each(function(g,f){var d=new Element("img",{"class":"navbutton",src:"http://assets.amung.us/images/stats/icons/"+g+".png"});d.setStyle("cursor","pointer");if(!slowBrowser()){var h=new Fx.Morph("arrow",{duration:250,fps:120,transition:Fx.Transitions.Quint.easeInOut});if(statsnavpos!=f){d.fade(0.4)}var e=new Fx.Tween(d,{duration:100})}d.addEvent("mouseover",function(){var i=(f>=b.length-4)?f*48+12+36:f*48+12;if(!slowBrowser()){$$("#statsnavbuttons .navbutton").each(function(j){j.setStyle("opacity",0.4)});e.start("opacity",1);h.start({"margin-left":i})}else{$("arrow").setStyle("margin-left",i)}});if(!slowBrowser()){d.addEvent("mouseleave",function(){e.cancel();d.setStyle("opacity",0.4)})}d.addEvent("click",function(){var i="/stats/";if(window.location.href.indexOf("/wibiya/istats/")>=0){i="/wibiya/istats/"}if(g=="home"){window.location=i+sitekey+"/"}if(g=="recents"||g=="grouped"){poller.change_list(g)}if(g=="pins"){poller.show_pins()}if(g=="heatmap"){poller.show_heatmap()}if(g=="hourly"||g=="daily"||g=="monthly"||g=="yearly"){poller.change_timeline(g)}if(g.indexOf("_page")>=0){g=g.split("_");window.location=i+g[0]+"/"+sitekey+"/"}statsnavpos=f});if(f==b.length-4){d.setStyle("margin-left",36)}d.inject($("statsnavbuttons"))})}function insertLoaders(){var c="http://assets.amung.us/images/stats/";var a=$$(".wau_loader");var b=$$(".nodata");a.each(function(d){var e=new Element("img",{"class":"appwait",src:c+"icons/appwait.png"});var f=new Element("img",{"class":"spinner",src:c+"loader.gif"});e.inject(d);f.inject(d)});b.each(function(d){var e=new Element("img",{"class":"bigx",src:c+"icons/bigx.png"});e.inject(d)})}function slowBrowser(){if(Browser.ie&&Browser.version<9){return true}else{return false}};