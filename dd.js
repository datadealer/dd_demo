function getcurve(sx,sy,ex,ey) {
    var m1x,m1y,m2x,m2y,m3x,m3y;
    var offx,offy;
    if (sx < ex) { offx=sx } else { offx=ex }
    if (sy < ey) { offy=sy } else { offy=ey }
    xlen = Math.abs(sx-ex);
    ylen = Math.abs(sy-ey);
    m2x = xlen/2 + offx;
    m2y = ylen/2 + offy;
    m1x = xlen/4 + offx;
    m3x = 3*(xlen/4) + offx;
    if (sx < ex) {
        m1y = sy;
        m3y = ey;
        var path = ["M"+sx,+sy+" Q"+m1x,m1y+" "+m2x,m2y+" Q"+m3x,m3y+" "+ex,ey].join(",");
    } else {
        m1y = ey;
        m3y = sy;
        var path = ["M"+sx,+sy+" Q"+m3x,m3y+" "+m2x,m2y+" Q"+m1x,m1y+" "+ex,ey].join(",");
    }
    return path;
}

function getstraight(sx,sy,ex,ey) {
    return ["M"+sx,sy+"L"+ex,ey].join(",");
}

function pan_to(dx, dy, panner) {
    // used by panner drag handler and to position paper after switch
    var old_x = panner.ole_x;
    var old_y = panner.ole_y;
    if (old_x == undefined) { old_x = 0; dx = -dx; }
    if (old_y == undefined) { old_y = 0; dy = -dy; }
    var vdx = Math.min(Math.max(old_x-dx, 0), W-VPW);
    var vdy = Math.min(Math.max(old_y-dy, 0), H-VPH);
    panner.paper.setViewBox(vdx,vdy,VPW,VPH,false);
    if (panner.paper._fixed != undefined) {
        panner.paper._fixed.stop();
        panner.paper._fixed.attr({'transform':'t'+vdx+','+vdy});
    }
}

/* ########### Raphael element extensions ####################### */

Raphael.el.hide_if_hidden = function(active) {
    if (active) {
        return this;
    } else {
        return this.hide();
    }
}

Raphael.fn.center_of_viewport = function() {
    var x = this._viewBox[0] + Math.round(this._viewBox[2]/2);
    var y = this._viewBox[1] + Math.round(this._viewBox[3]/2);
    return {x: x, y: y};
}

Raphael.el.make_draggable = function() {
    // make a Raphael element with associated Project-like object containing subelems draggable in a
    // paper of dimenstions w x h
    var elem = this;
    elem.drag(function(dx, dy) {
            // while dragged
            if (this.dragged || Math.abs(dx) > 3 || Math.abs(dy) > 3){
              if (!this.dragged) {
                  this.dragged = true;
                  $.each(this.item.subelems, function(k, v) {
                                                v.elem.hide();
                                                if (v.elem._bar) {
                                                    v.elem._bar.hide();
                                                }
                  });
              }
              this.attr({
                  x: Math.min(Math.max(this.ole_x+dx, 16), this.paper._panner.attr('width')-this.attr("width")-16),
                  y: Math.min(Math.max(this.ole_y+dy, 36), this.paper._panner.attr('height')-this.attr("height")-32)
              });
              $.each(this.item.subelems, function(k, v) {
                                v.elem.attr({
                                    x: elem.attr('x') + v.offset_x,
                                    y: elem.attr('y') + v.offset_y
                                });
                                if (v.elem._bar) {
                                v.elem._bar.attr({x: elem.attr('x') + v.offset_x + v.settings.bar_offset_left,
                                                  y: elem.attr('y') + v.offset_y + v.settings.bar_offset_top});
                                }
                            });
              if (elem._cbar) {
                  if (!elem._cbar.removed) elem._cbar.remove();
              }
              var center = this.center_of_image();
              if (this.conn_paths) {
                  $.each(this.conn_paths, function(k, v) {
                      var end = elem.get_path_end(this);
                      v.attr({"path": getstraight(end.x, end.y, center.x, center.y),'stroke-dasharray':'-'});
                  });
              }
            }
          }, function() {
              // drag start
              var me = this;
              var center = this.center_of_image();
              if (this.conn_paths) {
                  $.each(this.conn_paths, function(k,v) { 
                    v.stop();
                    var end = elem.get_path_end(this);
                    this.attr("path", getstraight(end.x, end.y, center.x, center.y));
                    if (me.item.className=="CustomerElement") v.attr("stroke",CONN_OUT.stroke);
                  });
              }
              this.animate({'opacity':1},200,function(){
                this.dragged =true;
                $.each(this.item.subelems, function(k, v) {
                                                v.elem.hide();
                                                if (v.elem._bar) {
                                                    v.elem._bar.hide();
                                                }
                                            });
              });
              this.item.getSet().toFront();
              eve('mainview.new_element', this);
              this.ole_x = this.attr('x');
              this.ole_y = this.attr('y');
          }, function() {
              // drag end
              this.dragged =false;
              var my_x = this.attr('x');
              var my_y = this.attr('y');
              $.each(this.item.subelems, function(k, v) {
                                                v.elem.show();
                                                if (v.elem._bar) {
                                                    v.update_bar();
                                                    v.elem._bar.show();
                                                    v.elem._bar.toFront();
                                                    eve('mainview.new_element', v.elem._bar);
                                                }
                                            });
              var center = this.center_of_image();
              if (this.conn_paths) {
                  $.each(this.conn_paths, function (k,v) {
                      var end = elem.get_path_end(this);
                      v.animate({"path":getcurve(end.x, end.y, center.x, center.y)},1200,"elastic");
                          v.attr('stroke-dasharray','');
                  });
              }
          });
}

Raphael.el.get_path_end = function(p) {
    var endpoint = _.without(p.endpoints, this)[0];
    return endpoint.center_of_image();
}

Raphael.el.bounce_on_create = function(height, y) {
    this.animate({height:height*2, y: y - height/2}, 100, 'backOut',
                 function() { this.animate({height:height, y: y}, 300, 'bounce'); });
    return this;
}

Raphael.el.bounce_on_destroy = function(height, y, offset, cb) {
    var elem = this;
    var center_of_elem = elem.center_of_image();
    var thisani = elem.animate({'opacity':0,transform:'s1.6'}, 300, '>',cb);
}


Raphael.el.pulsate_conn_paths = function(item,reverse) {
                  var scol1 = CONN_IN.stroke;
                  var scol2 = CONN_OUT.stroke;
                  if (reverse) {
                      scol2 = CONN_IN.stroke;
                      scol1 = CONN_OUT.stroke;
                  }
                  $.each(item.elem.conn_paths, function(k, v) {
                      v.animate({
                        "25%":{'stroke':scol2},
                        "50%":{'stroke':scol1},
                        "75%":{'stroke':scol2},
                        "100%":{'stroke':scol1}
                      },400);
                  });
}

Raphael.el.profile_bling = function(item,psamount) {
    var amount = ksNum(psamount);
    var elem = this;
    var center_of_elem = elem.center_of_image();
    var center_of_par = item.elem.center_of_image();
    var temptext = elem.paper.text(center_of_elem.x,elem.attr('y')-16, amount).attr(PROFILE_FONT).attr('opacity',0).hide_if_hidden(elem.paper._active_view.active);
    item.view._rawelems.push(temptext);
    temptext.animate({
        "20%":{'opacity':0.5},
        "70%":{'opacity':1,'transform':'s2.7'},
        "100%":{'opacity':0,'transform':'s3',callback:function(){
                        item.view._rawelems = _.without(item.view._rawelems, temptext);
                        temptext.remove();
            }}
    },500);
}

Raphael.el.money_bling = function(item,income) {
    income = "$ "+item.view.game.bars.bars['money_bar'].kiloSepNumber(income);
    var elem = this;
    var center_of_elem = elem.center_of_image();
    var center_of_par = item.elem.center_of_image();
    var dest = item.view.game.bars.bars['money_bar'].bar_deco.center_of_image();
    var tempicon2 = elem.paper.image('img/icon-money_s1.png',center_of_elem.x-22.5,center_of_elem.y-22.5,59,45).attr('opacity',0).hide_if_hidden(elem.paper._active_view.active);
    var temptext = elem.paper.text(center_of_elem.x,center_of_elem.y, income).attr(MONEY_FONT).attr('opacity',0).hide_if_hidden(elem.paper._active_view.active);
    item.view._rawelems.push(tempicon2);
    item.view._rawelems.push(temptext);
    temptext.animate({
        "20%":{'opacity':0.5},
        "70%":{'opacity':1,'transform':'s2.7'},
        "100%":{'opacity':0,'transform':'s3'}
    },500);
    tempicon2.setup_xp_clicker();
    tempicon2.animate({
            "0%":{'opacity':0,'transform':'t0,0s1.5r0','easing':'linear'},
            "30%":{'opacity':1,'transform':'t0,80s1r20','easing':'bounce'},
            "40%":{'opacity':1,'transform':'t0,80s1r20','easing':'bounce'},
            "50%":{'opacity':1,'transform':'t0,80s1r30'},
            "90%":{x:dest.x-30,y:dest.y-20,'transform':'t0,0s1r360','easing':'backIn'},
            "100%":{'transform':'t0,0s1.2r360','opacity':0,callback:function(){
                        item.view._rawelems = _.without(item.view._rawelems, tempicon2);
                        item.view._rawelems = _.without(item.view._rawelems, temptext);
                        tempicon2.remove();
                        temptext.remove();
                        }
            }
    },1000);
}
Raphael.el.let_em_fly = function(item,reverse,cb) {
  // animate along
    var elem = this;
    var dbelem = elem.paper._game.main_view.database.elem;
    var center_of_db = dbelem.center_of_image();
    var center_of_elem = elem.center_of_image();
    var center_of_item = item.elem.center_of_image();
    if (item.className=='ContactElement'){
         var center_of_agent = item.agent.elem.center_of_image();
         var tempicon = elem.paper.image('img/icon-profile_s1.png',center_of_elem.x-22.5,center_of_elem.y-22.5,30,30).attr('opacity',0).hide_if_hidden(elem.paper._active_view.active);
         tempicon.cap = elem.paper.path(getcurve(center_of_item.x,center_of_item.y,center_of_agent.x,center_of_agent.y)).hide();
         tempicon.setup_xp_clicker();
         item.view._rawelems.push(tempicon);
         tempicon.attr({'distance':0});
         tempicon.animate({
                        '0%': {'opacity':0,'transform':'t0,-120s1.5'},
                        '20%': {'opacity':1,'transform':'t0,0s1','easing':'bounce'},
                        '40%': {'opacity':1,'distance':100, 'easing':'<', callback:function(){
                             tempicon.cap.attr('path',getcurve(center_of_db.x,center_of_db.y,center_of_agent.x,center_of_agent.y));
                            }},
                        '80%': {'opacity':1,'distance':0, 'easing':'<>'},
                        '90%': {'transform':'r15','opacity':0, callback:function(){
                                   dbelem.animate({
                                     '25%':{'transform':'s1.1,1'},
                                     '50%':{'transform':'s1,1.1'},
                                     '75%':{'transform':'s1.1'},
                                     '100%':{'transform':'s1'}
                                   },150);
                                 }
                               },
                        '100%':{'opacity':0, callback:function(){
                                  item.view._rawelems = _.without(item.view._rawelems, tempicon);
                                  tempicon.cap.remove();
                                  tempicon.remove();
                                  item.view.database.markProfilesWaiting();
                                   } 
                               }
                        },3000);

        }
    else {
         var s = 0;
         var e = 100;
         var timg = 'img/icon-profile_s1.png';
         if (reverse) {
             s=100;
             e=0;
             timg='img/icon-profile-out_s1.png';
             }
         var tempicon = elem.paper.image(timg,center_of_elem.x-22.5,center_of_elem.y-22.5,30,30).attr('opacity',0).hide_if_hidden(elem.paper._active_view.active);
         item.view._rawelems.push(tempicon);
         tempicon.setup_xp_clicker();
         tempicon.cap = elem.paper.path(getcurve(center_of_item.x,center_of_item.y,center_of_db.x,center_of_db.y)).hide();
         tempicon.attr({'distance':s});
         if (reverse){
         tempicon.animate({
                        '10%': {'opacity':1,'transform':'t0,0s1','easing':'bounce'},
                        '80%': {'opacity':1,'distance':e, 'easing':'<>'},
                        '90%': {'transform':'r15','opacity':0, callback:function(){
                                   item.elem.animate({
                                     '25%':{'transform':'s1.1,1'},
                                     '50%':{'transform':'s1,1.1'},
                                     '75%':{'transform':'s1.1'},
                                     '100%':{'transform':'s1'}
                                   },150);
                                 }
                               },
                        '100%':{'opacity':0, callback:function(){
                                  item.view._rawelems = _.without(item.view._rawelems, tempicon);
                                  tempicon.cap.remove();
                                  tempicon.remove();
                                  if (cb){cb();}
                                   } 
                               }
                        },2000);
         } else {
          tempicon.animate({
                        '0%': {'opacity':0,'transform':'t0,-120s1.5'},
                        '40%': {'opacity':1,'transform':'t0,0s1','easing':'bounce'},
                        '80%': {'opacity':1,'distance':e, 'easing':'<>'},
                        '90%': {'transform':'r15','opacity':0, callback:function(){
                                   dbelem.animate({
                                     '25%':{'transform':'s1.1,1'},
                                     '50%':{'transform':'s1,1.1'},
                                     '75%':{'transform':'s1.1'},
                                     '100%':{'transform':'s1'}
                                   },150);
                                 }
                               },
                        '100%':{'opacity':0, callback:function(){
                                  item.view._rawelems = _.without(item.view._rawelems, tempicon);
                                  tempicon.cap.remove();
                                  tempicon.remove();
                                  item.view.database.markProfilesWaiting();
                                   } 
                               }
                        },2000);
            
         }
       }
}

Raphael.el.setup_xp_clicker = function() {
    // xp clicker schmaeh
    var elem = this;
    this._xpclix = 1;
    elem.click(function() {
        eve('bar.update.value', elem.paper, 'xp_bar', elem._xpclix);
        this._xpclix = 2 * this._xpclix;
    });
    return elem;
}

Raphael.el.setup_click_ready = function(decorator) {
    // click handler for ready-flags
    var elem = this;
    elem.click(function() { 
        var view = decorator.view;
        if (view.game.ap>0) {
          decorator.parent_item.unmarkReady();
        } else {
          lockscreen_AP();
        }
    });
}

Raphael.el.mouseupdown_change_src = function(sprite_img,sprite_img_down,sprite_img_drag) {
    var relem = this;
    var reset_sprite = sprite_img;
    relem.mousedown(function(){
      this.animate({'opacity':1},200,function(){
        this.attr({src: sprite_img_drag});
      });
    });
    relem.mouseup(function(){
      this.stop();
      if (!this.dragged){
        this.attr({src: sprite_img_down});
      }
      this.animate({'opacity':1},40,function(){
        this.attr({src: reset_sprite});
      });
        
    });
}

Raphael.el.hover_change_src = function(sprite_img_hover) {
    var relem = this;
    var reset_sprite = relem.attr('src');
    relem.hover(function () { 
                              if (!this.dragged){
                                this.transform('');
                                this._hover = true;
                                this.anim_bouncy();
                                this.attr({src: sprite_img_hover});
                              }
                            },
                function () { 
                              if (!this.dragged){
                                this.attr({src: reset_sprite});
                                if (!this.removed) {
                                    this.transform('s1');
                                    this.transform('');
                                }
                                this._hover = false;
                              }
                            });
}

Raphael.el.hover_working = function(sprite_img_hover) {
    var relem = this;
    var paritem = relem.item.parent_item;
    var reset_sprite = relem.attr('src');
    relem.hover(function () {
                                this.attr({src: sprite_img_hover});
                                this.stop = false;
                                var me = this;
                                var draw_timer = function () {
                                    if (paritem._timer) paritem._timer.remove();
                                    var time = paritem.ready_in();
                                    if (me.paper && !me.stop && time.abs > 200) {
                                        paritem._timer = me.paper.text(me.attr('x') + 13, me.attr('y') - 12, toTime(time.abs)).attr(TIMER_FONT);
                                        eve('mainview.new_element', paritem._timer);
                                        setTimeout(draw_timer, 10);
                                    } else {
                                        if (paritem._timer) paritem._timer.remove();
                                    }
                                }
                                draw_timer();
                            },
                function () {
                                this.attr({scr: reset_sprite});
                                this.stop = true;
                                if (paritem._timer) paritem._timer.remove();
                            });
}

Raphael.el.cbar = function(item, val, r, w, dur) {
    // draws a circular progress bar around element center, returns element
    var c = this.center_of_image();
    item.elem._cbar_val = val;
    item.elem._cbar_r = r;
    item.elem._cbar_w = w;
    var draw_new = false;
    if (item.elem._cbar) {
        if (item.elem._cbar.removed) draw_new = true;
    } else {
        draw_new = true;
    }
    if (draw_new) {
        item.elem._cbar = this.paper.path().attr({'stroke-width': w}).attr({arc: [c.x, c.y, 0, 100, r]}).hide().insertBefore(this);
    }
    item.elem._cbar.attr({arc: [c.x, c.y, val, 100, r], 'stroke-width': w}).hide();
    if (!item.elem.dragged) item.elem._cbar.show().hide_if_hidden(item.view.active);
    return this;
}

Raphael.el.rotate_working = function() {
    var relem = this;
    var rotator360 = function () {
        if (relem.paper) relem.animate({'transform':'s1.1r15'}, 150, '>', function() { rotator0(); });
    }
    var rotator0 = function () {
        if (relem.paper) relem.animate({'transform':'s0.9r-15'}, 150, '<', function() { rotator360(); });
    }
    var urotator = function () {
        if (relem.paper) relem.attr({transform: 'r0'}).animate({'transform':'r360'}, 1000, 'linear', function() { urotator(); });
    }
    // rotator360();
    setTimeout(urotator, 500);
    return this;   
}

Raphael.el.anim_shiver = function() {
    // shiver animation
    var relem = this;
    var s1 = "s0.9,1.1"
    var s2 = "s1.05,0.95";
    var oldt = relem.transform().toString();
    return relem.animate({
             '50%':{'transform':s2},
             '100%':{'transform':s1,callback:function () { if (relem) { relem.transform(oldt); } }}
             },100);
}




Raphael.el.anim_bouncy = function() {
    // bouncy animation
    var relem = this;
    //var oldt = relem.transform().toString();
    return relem.animate({
          '12%':{'transform':'s1.1','easing':'>'},
          '24%':{'transform':'s1.05','easing':'<'},
          '76%':{'transform':'s1','easing':'bounce'}
        },260);
}


Raphael.el.connect_to = function(other) {
    // connects this raphael elem with another with a path
    var item = this;
    var center = item.center_of_image();
    var center_other = other.center_of_image();
    var capath=getcurve(center_other.x, center_other.y, center.x, center.y);
    var conn_attr = CONN_IN;
    if (this.item.className == 'CustomerElement') {
        conn_attr = CONN_OUT;
    }
    var cap = item.paper.path(capath).attr(conn_attr).toBack().hide_if_hidden(item.paper._active_view.active);
    cap.click(function(){
        var len = this.getTotalLength();
        var s = this.getPointAtLength(0);
        var e = this.getPointAtLength(len);
        this.animate({'path':getstraight(s.x,s.y,e.x,e.y)},50,"<>",function(){
        this.animate({'path':getcurve(s.x,s.y,e.x,e.y)},500,"elastic");
            });
        });
    item.paper._active_view._panner.toBack();
    cap.endpoints = new Array(item, other);
    item.add_conn_path(cap);
    other.add_conn_path(cap);
}

Raphael.el.disconnect = function() {
    // use disconnect from instead!
    if (this.conn_paths) {
         $.each(this.conn_paths, function(k, v) {
            v.remove();
         });
         this.conn_paths=undefined;
    }
}
Raphael.el.disconnect_from = function(other) {
    var this_cp = [];
    var found_id = false;
    var found = false;
    var other_cp = [];
    $.each(this.conn_paths, function(k, v) {
        var foundit=false;
        $.each(other.conn_paths, function(kk,vv){
            if (v.id==vv.id) {
                found_id=vv.id;
                found=vv;
                foundit=true;
            }
        });
        if (!foundit) {
            this_cp.push(v);
        }
    });
    $.each(other.conn_paths,function(k,v){
        if (v.id!=found_id) {
            other_cp.push(v);
        }
    });
    other.conn_paths=other_cp;
    this.conn_paths=this_cp;
    if (!this_cp.length) this.conn_paths=undefined;
    if (!other_cp.length) other.conn_paths=undefined;
    if (found) found.remove();
}

Raphael.el.add_conn_path = function(path) {
    if (this.conn_paths == undefined) {
        this.conn_paths = new Array(path);
    } else {
        this.conn_paths.push(path);
    }

}

Raphael.el.center_of_image = function() {
    // returns coordinates of the center of a raphael image element
    var box = this.getBBox();
    return { x: Math.abs(box.x + (box.width/2)),
             y: Math.abs(box.y + (box.height/2))};
}

/* ######################## DDGame class ################### */

function DDGame() {
    this.maincanvas = '#canvas';
    this.canvas = $(this.maincanvas);
    this.canvas.css('width', VPW);
    this.canvas.css('height', VPH);
    this.viewport_width = VPW;
    this.viewport_height = VPH;
    this.init_paper();
    this.init_main_view();
    this.init_db_view();
    this.init_help_view();
    this.db_view.create_initial_tokens();
    this.main_view.create_initial_projects();
    this.main_view.create_initial_agents();
    this.main_view.create_initial_customers();
    this.main_view.create_debug_buttons(false);
    this.main_view.show();
    pan_to(SHIFTX,SHIFTY,this.main_view.paper._panner);
    this.startFixedTimer();
    this.start_intro();
    return this;
}

Object.defineProperty(DDGame.prototype, "ap", {get: function() { return this.bars.getAP(); }, set: function(v) { this.bars.setAP(v);}});
Object.defineProperty(DDGame.prototype, "xp", {get: function() { return this.bars.getXP(); }, set: function(v) { this.bars.setXP(v);}});
Object.defineProperty(DDGame.prototype, "level", {get: function() { return this.bars.getLevel(); }});
Object.defineProperty(DDGame.prototype, "money", {get: function() { return this.bars.getMoney(); }, set: function(v) { this.bars.setMoney(v); }});
Object.defineProperty(DDGame.prototype, "profiles", {get: function() { return this.bars.getProfiles();}, set: function(v) { this.bars.setProfiles(v); }});

DDGame.prototype.init_help_view = function() {
    var me = this;
    $('#help').load('help.html');
    me.help=false;
    $('#switch_help').click(function() { 
        me.switch_help();
    });
}

DDGame.prototype.init_main_view = function() {
    var me = this;
    this.main_view = new MainView(this.paper, false);
    this.paper._active_view = this.main_view;
    this.main_view.game = this;
    this.main_view.init_panner();
    this.paper._bars = new StatusBar(this.main_view);
    this.main_view.get_database();
    this.bars = this.paper._bars;
    this.bars.startAPTimer();
    $('#switch_main').click(function() { me.switch_main(); });
    $("#switch_main").addClass('active');
    return this;
}
DDGame.prototype.init_db_view = function() {
    var me = this;
    this.db_view = new DBView(this.paper, false);
    this.db_view.game = this;
    this.db_view.init_panner();
    $('#switch_db').click(function() { me.switch_db(); });
    return this;
}
DDGame.prototype.init_paper = function() {
    // initialize main paper element
    this.paper = Raphael(this.canvas.attr('id'), this.viewport_width, this.viewport_height);

    this.paper.customAttributes.distance = function (value) {
        value = this.cap.getTotalLength() / 100 * value;
        var point = this.cap.getPointAtLength(value);
        return { x: point.x-this.attr('width')/2, y: point.y-this.attr('height')/2, transform:"r"+point.alpha };
    };
    this.paper.customAttributes.arc = function (cx, cy, value, total, R) {
        // for circular progress bar painting
        var alpha = 360 / total * value,
            a = (90 - alpha) * Math.PI / 180,
            x = cx + R * Math.cos(a),
            y = cy - R * Math.sin(a),
            //color = "hsb(".concat(Math.min(1.3-(value/total), 1), ",", value / total, ", .75)")
            path,
            color = '#7F3187';
        if (total == value) {
            path = [["M", cx, cy - R], ["A", R, R, 0, 1, 1, cx-0.1, cy - R]];
        } else {
            path = [["M", cx, cy - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
        }
            return {path: path, stroke: color, opacity:0.5};
    };

    this.paper._fixed = this.paper.set();
    this.paper._game = this;
    this.paper._active_view = {};
    // init viewbox
    this.paper.setViewBox(0, 0, this.viewport_width, this.viewport_height);
    return this;
}
DDGame.prototype.switch_db = function() {
    if (this.paper._active_view != this.db_view) {
        $('#help_wrap').hide();
        this.main_view.hide();
        this.db_view.show();
        $('#db_queue').show();
        $('#wrap_all').css('box-shadow','0px 0px 128px #1A6B88');
        $("#switch_db").addClass('active');
        $("#switch_main").removeClass('active');
        $("#switch_help").removeClass('active');
        $('#canvas_wrap').show();
        this.help=false;
    } else if (this.help) {
        this.help=false;
        $('#wrap_all').css('box-shadow','0px 0px 128px #1A6B88');
        $("#switch_main").removeClass('active');
        $("#switch_help").removeClass('active');
        $("#switch_db").addClass('active');
        $('#help_wrap').hide();
        $('#canvas_wrap').show();
    }
}
DDGame.prototype.switch_main = function() {
    if (this.paper._active_view != this.main_view) {
        this.db_view.hide();
        $('#db_queue').hide();
        this.main_view.show();
        $('#wrap_all').css('box-shadow','0px 0px 128px #3D5721');
        $("#switch_main").addClass('active');
        $("#switch_help").removeClass('active');
        $("#switch_db").removeClass('active');
        $('#help_wrap').hide();
        $('#canvas_wrap').show();
        this.help=false;
    } else if (this.help) {
        this.help=false;
        $('#wrap_all').css('box-shadow','0px 0px 128px #3D5721');
        $("#switch_main").addClass('active');
        $("#switch_help").removeClass('active');
        $("#switch_db").removeClass('active');
        $('#help_wrap').hide();
        $('#canvas_wrap').show();
    }
}


DDGame.prototype.switch_help = function() {
    if (!this.help) {
      this.help=true;
      $("#switch_help").addClass('active');
      $("#switch_main").removeClass('active');
      $("#switch_db").removeClass('active');
      $('#canvas_wrap').hide();
      $('#wrap_all').css('box-shadow','0px 0px 128px #666');
      $('#help_wrap').show();
    }
}

DDGame.prototype.startFixedTimer = function() {
    var me = this;
    var tick = function () {
        eve('game.clock.tick', me);
        setTimeout(tick, 5000);
    }
    tick();
    return me;
}

DDGame.prototype.getContactById = function(cid){
  result=undefined;
  $.each(this.main_view._contacts,function(k,v){
      if (v.settings.data_id==cid){
          result=v;
      }
  });
  return result;
}
DDGame.prototype.getProjectById = function(cid){
  result=undefined;
  $.each(this.main_view._projects,function(k,v){
      if (v.settings.data_id==cid){
          result=v;
      }
  });
  return result;
}


DDGame.prototype.intro_sequence = function(seq,index,skip) {
  if (index>=seq.length) return true;
  var game = this;
  var s = seq[index];
  var popid="lockscreen_intro"
  if (s.hide_db) {
      game.main_view.database.hide();
  } else if (s.show_db) {
      game.main_view.database.show();
  }
  s.view = game[s.view_id];
  if (s.view_id=='db_view'){
    game.switch_db();
  } else {
    game.switch_main();
  }
  var noskip = false;
  if (s.noskip) noskip=true;
  pan_to(s.x,s.y,s.view._panner);
  var data = {
        id:popid,
        grfx:s.grfx,
        title:s.title,
        text:s.text,
        button_text:"OK",
        noskip:noskip
  }
  $.each(s.agents,function(k,id){
      var settings=getItemSettings(id,s.view);
      var item = new AgentElement(s.view, settings).render();
      item.elem.connect_to(s.view.database.elem);
      //if (settings.ready) { item.markReady(); }
  });
  $.each(s.projects,function(k,id){
      var settings=getItemSettings(id,s.view);
      var item = new ProjectElement(s.view, settings).render();
      item.elem.connect_to(s.view.database.elem);
      if (settings.ready) { item.markReady(); }
  });
  $.each(s.customers,function(k,id){
      var settings=getItemSettings(id,s.view);
      var item = new CustomerElement(s.view, settings).render();
      item.elem.connect_to(s.view.database.elem);
      if (settings.ready) { item.markReady(); }
  });
  $.each(s.contacts,function(k,id){
      var settings=getItemSettings(id,s.view);
      if (settings.agent) {
          var c_item = new ContactElement(s.view, settings, settings.agent).render();
          if (settings.ready) { c_item.markReady(); }
          c_item.connectToAgent();
      } else {
          console.log('Error: No Agent')
      }
  });
  if (s.contact_ready) {
      $.each(s.contact_ready,function(k,v){
          var doit = function(){game.getContactById(v).unmarkReady();};
          setTimeout(doit,800);
      })
  }
  if (s.project_ready) {
      $.each(s.project_ready,function(k,v){
          var doit = function(){game.getProjectById(v).unmarkReady();};
          setTimeout(doit,800);
      })
  }

  if (!skip) {
    var popup = $('#introTemplate').template(popid);
    $.tmpl(popid,data).hide().appendTo("#canvas_wrap");
    var popup = $("#"+popid);
    open_popup(popup,function(){
        var pp = $(".popup",popup);
    });
    $(".intro-skip",popup).click(function(){
      popup.hide(0,function(){
                     popup.remove();
                     game.intro_sequence(seq,index+1,true);
      });
    });
    $(".button",popup).click(function(){
      popup.hide(0,function(){
                     popup.remove();
                     game.intro_sequence(seq,index+1);
      });
    });
  } else {
    game.intro_sequence(seq,index+1,true);
  }
}

DDGame.prototype.start_intro = function() {
    this.intro_sequence(intro_data,0);
}
DDGame.prototype.start_levelup = function(level) {
    if ($("#ppopup").length) close_popup($("#ppopup"));
    this.intro_sequence(levelup_data01,0);
}




/* ######################## GameView base class ################### */

function GameView(paper, active) {
    return this.__init__(paper, active);
}

GameView.prototype.__init__ = function(paper, active) {
    var me = this;
    this.paper = paper;
    this.active = active;
    eve.on('game.clock.tick', me.tickhandler);
    return this;
}

GameView.prototype.tickhandler = function() {
    var me = this.main_view;
    if (me._projects) {
        $.each(me._projects, function(k, v) {
            v.tickhandler();
        });
    }
    if (me._contacts) {
        $.each(me._contacts, function(k, v) {
            v.tickhandler();
        });
    }
    if (me._customers) {
        $.each(me._customers, function(k, v) {
            v.tickhandler();
        });
    }
}

GameView.prototype.hide = function() {
    var me = this;
    this.saved_viewport = {x: this.paper._viewBox[0], y: this.paper._viewBox[1]};
    this.active = false;
    var c = this.paper.center_of_viewport();
    this.getViewElems().hide();
}

GameView.prototype.show = function(center) {
    var me = this;
    var c = this.paper.center_of_viewport();
    if (this.saved_viewport) pan_to(this.saved_viewport.x, this.saved_viewport.y, this._panner); 
    /*this.getViewElems().animate({transform: 's1,1'}, 10, '>', function() { 
        me.active = true; 
        me.paper._panner = this._panner;
        me.paper._active_view = me;
    }).show(); */
    this.getViewElems().show();
    this.active = true;
    this.paper._panner = this._panner;
    this.paper._active_view = this;
}

GameView.prototype.init_panner = function() {
    var img = this.panner_image_file;
    this._panner = this.paper.image(img, 0, 0, W, H).toBack().hide_if_hidden(this.active);
    this._panner.drag(function(dx, dy) {
        // mousemove
        pan_to(dx, dy, this);
       },function(){
        // mousedown
          this.ole_x =  this.paper._viewBox[0];
          this.ole_y =  this.paper._viewBox[1];
          this.dragged=true;
         },function(){
        // mouseup
          this.ole_x = undefined;
          this.ole_y = undefined;
          this.dragged=false;
        });
    if (this.active || !this.paper._panner) {
        this.paper._panner = this._panner;
    }
    return this;
}

GameView.prototype.pin_element = function() {
    var vb = this.paper._viewBox;
    var me = this;
    $.each(arguments, function(k, v) {
        me.paper._fixed.push(v);
        v.attr({'transform': 't'+vb[0]+ ',' + vb[1]});
    });
}

GameView.prototype.unpin_element = function() {
    var me = this;
    $.each(arguments, function(k, v) {
        me.paper._fixed.exclude(v);
        if (this.paper != undefined) {
            this.paper._fixed.exclude(v);
        }
    });
}

GameView.prototype.getViewElems = function() {
    console.log('Unimplemented');
}

/* ######################## DBView class ################### */

function DBView(paper, active) {
    this._rawelems = new Array();
    this.panner_image_file = "img/database-background.jpg";
    return this.__init__(paper, active);
}
extend(DBView, GameView);

DBView.prototype.getViewElems = function() {
    var me = this;
    var result = this.paper.set();
    var elems = new Array().concat(this._tokens);
    $.each(elems, function(k, v) {
        if (v.elem) { 
            result.push(v.elem); 
            if (v.elem._cbar) result.push(v.elem._cbar);
            if (v.elem.conn_paths) $.each(v.elem.conn_paths, function(ki,vi) { result.push(vi); });
        }
        if (v.subelems) $.each(v.subelems, function(ku,vu) { result.push(vu.elem);
                                                             if (vu.elem._bar) {
                                                               result.push(vu.elem._bar);
                                                             }
                                                           });
        });
    if (this._rawelems) $.each(this._rawelems, function(x, y) { result.push(y); });
    if (this._panner) result.push(this._panner);
    return result;
}

DBView.prototype.create_initial_tokens = function() {
    var me = this;
    var ps = new ProfileSet(me, db_profileset);
    ps.render();
    this.profiles = ps;
}

Object.defineProperty(DBView.prototype, "_tokens", {get: function() { if (this.profiles) { return this.profiles.getElements(); } else { return new Array(); } }});

/* ######################## DBQueue class #################### */

function DBQueue(db) {
    this.db = db;
    this.profile_sets = new Array();
    return this;
}

DBQueue.prototype.render = function() {
    var me = this;
    var wrap = this.clear_render();
    var reversedset = this.profile_sets.slice(0);
    reversedset.reverse();
    $.each(reversedset, function(k, v) {
        if (k<15) {
          me.make_elem(v);
        }
    });
    return wrap;
}

DBQueue.prototype.clear_render = function() {
    return $(".db_queue_item",this.get_jq_elem()).remove();
}

DBQueue.prototype.get_jq_elem = function() {
    return $('#db_queue');
}

DBQueue.prototype.make_elem = function(profileset) {
    if (this.profile_sets.length>0) {
          $('#db_queue_title').show();
    }
    var wrap = this.get_jq_elem();
    var newelem = $('<div class="db_queue_item">');
    newelem.data('profileset', profileset);
    var amount_elem = $('<span class="amount">');
    amount_elem.text(ksNum(profileset._anzahl));
    amount_elem.appendTo(newelem);
    this.decorate_elem(newelem).appendTo(wrap, newelem);
    profileset.elem=newelem;
    return newelem;
}

DBQueue.prototype.decorate_elem = function(elem) {
    return elem.hover(function() {
            $(this).toggleClass( "hover", 50 );
            return false;
        },function() {
            $(this).toggleClass( "hover", 200 );
            return false;
    }).click(function(){
        profileset_popup($(this).data('profileset'));
    });
}

DBQueue.prototype.add = function(profileset) {
    // Adds a profileset to queue
    this.profile_sets.push(profileset);
    this.render();
}
DBQueue.prototype.remove = function(profileset) {
    // Removes a profileset from the queue
    var me = this;
    var newqueue = _.without(this.profile_sets, profileset);
    //profileset.view.game.main_view.database.queue.remove(profileset);
    this.profile_sets = newqueue;
    profileset.view.game.main_view.database.unmarkProfilesWaiting();
    profileset.elem.hide(300,function(){
      me.render();
      if (newqueue.length==0) {
          $('#db_queue_title').hide(200);
      }
    });
}


/* ######################## MainView class ################### */

function MainView(paper, active) {
    this.initial_project_data = project_data;
    this.initial_agent_data = agent_data;
    this.initial_customer_data = customer_data;
    this.panner_image_file = "img/imperium-background.jpg";
    this.database_data = database_data;
    this._projects = new Array();
    this._agents = new Array();
    this._contacts = new Array();
    this._customers = new Array();
    this._rawelems = new Array();
    eve.on('mainview.new_element', fixed_to_front);
    return this.__init__(paper, active);
}
extend(MainView, GameView);

MainView.prototype.getViewElems = function() {
    var me = this;
    var result = this.paper.set();
    var elems = new Array().concat(this._projects).concat(this._agents).concat(this._contacts).concat(this._customers).concat(new Array(this.get_database()));
    $.each(elems, function(k, v) {
        if (v.elem) { 
            result.push(v.elem); 
            if (v.elem._cbar) result.push(v.elem._cbar);
            if (v.elem.conn_paths) $.each(v.elem.conn_paths, function(ki,vi) { result.push(vi); });
        }
        if (v.subelems) $.each(v.subelems, function(ku,vu) { result.push(vu.elem)});
        });
    if (this._rawelems) $.each(this._rawelems, function(x, y) { result.push(y); });
    if (this._panner) result.push(this._panner);
    return result;
}

MainView.prototype.get_database = function() {
    if (!this.database) {
        this.database = new DBElement(this, _.clone(this.database_data));
        this.database.queue = new DBQueue(this.database);
        this.database.render();
    }
    return this.database;
}

MainView.prototype.create_initial_projects = function() {
    var me = this;
    $.each(this.initial_project_data, function (k, v) {
        if (v.initial) {
          var item = new ProjectElement(me, v).render();
          if (v.ready) { item.markReady(); }
          item.elem.connect_to(me.database.elem);
        }
    });
}
MainView.prototype.create_initial_customers = function() {
    var me = this;
    $.each(this.initial_customer_data, function (k, v) {
        if (v.initial) {
          var item = new CustomerElement(me, v).render();
          if (v.ready) { item.markReady(); }
          item.elem.connect_to(me.database.elem);
        }
    });
}


MainView.prototype.create_initial_agents = function() {
    var me = this;
    $.each(this.initial_agent_data, function (k, v) {
        if (v.initial) {
          var item = new AgentElement(me, v).render();
          item.elem.connect_to(me.database.elem);
          $.each(v.contact_data, function (ck, cv) {
            if (cv.initial) {
              var c_item = new ContactElement(me, cv, item).render();
              if (cv.ready) { c_item.markReady(); }
              c_item.connectToAgent();
            }
          });
        }
    });
}

MainView.prototype.create_debug_buttons = function(debug) {
    if (!debug) {
        $("#debug").remove();
        return false;
    } 
    $("#logo").click(function(){
      $("#debug").toggle();
    });
    var me=this;
    $('#debug_center').click(function(){
        pan_to(480,320,me._panner);
    });
    $.each(this.initial_customer_data, function (k, v) {
        var button=$("<button>").html(v.title).click(function(){
            var item = new CustomerElement(me, v).render();
            if (v.ready) { item.markReady(); }
            item.elem.connect_to(me.database.elem);
            $(this).remove();
        });
      if (!v.initial) $("#dcustomers").append(button);
    });
    $.each(this.initial_project_data, function (k, v) {
      var button=$("<button>").html(v.title).click(function(){
          var item = new ProjectElement(me, v).render();
          if (v.ready) { item.markReady(); }
          item.elem.connect_to(me.database.elem);
          $(this).remove();
      });
      if (!v.initial) $("#dprojects").append(button);
    });
    $.each(this.initial_agent_data, function (k, v) {
      var button=$("<button>").html(v.title).click(function(){
          var item = new AgentElement(me, v).render();
          if (v.ready) { item.markReady(); }
          item.elem.connect_to(me.database.elem);
          $(this).remove();
      });
      if (!v.initial) $("#dagents").append(button);
    });
    function getAgentByTitle(title,view){
        var ragent=undefined;
        $.each(view._agents,function(k,agent){
              if (agent.settings.title==title) ragent=agent;
        });
        return ragent;
    }
    $.each(this.initial_agent_data, function (k, v) {
        $.each(v.contact_data, function (ck, cv) {
          var button=$("<button>").html(cv.title).click(function(){
              var agent=getAgentByTitle(v.title,me);
              if (!agent) {alert("agents first!");return false}
              var c_item = new ContactElement(me, cv, agent).render();
              if (cv.ready) { c_item.markReady(); }
              c_item.connectToAgent();
              $(this).remove();
          });
        if (!cv.initial) $("#dcontacts").append(button);
      });
    });
}

function load_images(cb) {
  // Collect all img URLs and preload
  lockscreen_loading();
  var loadlen=allimg.length;
  var loadcount=0;
  $.imgpreload(allimg,{
        each: function(){
            loadcount=loadcount+1;
            $("#loadprogress").text(loadcount+"/"+loadlen);
            },
        all: function(){
            if (cb) cb();
            $("#loadprogress").text("Fertig");
            setTimeout("unlockscreen_loading()",500);
            }
      });    
}



/* ##################### INIT ######################### */

$(document).ready(function(){
    load_images(function(){
      //GAME = new DDGame();
      var GAME = new DDGame();
    });
});
