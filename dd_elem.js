////////////////////////// BASIC UI ELEMENT ///////////////////////////

function BasicUIElement(view, settings) {
    // raphael UI element base class
    this.className = 'BasicUIElement';
    return this.__init__(view, settings);
}

BasicUIElement.prototype.__init__ = function(view, settings) {
    this.view = view;
    this.settings = settings;
    this.elem = false;
    return this;
}

BasicUIElement.prototype.get = function(k) {
    return this[k];
}

BasicUIElement.prototype.remove = function() {
    if (this.elem) {
        this.elem.remove();
        this.elem = false;
    }
}

////////////////////////// PROFILE SET ELEMENT //////////////////////////

function ProfileSet(view, token_map, anzahl_getter, origin) {
    this.className = 'ProfileSet';
    this._anzahl = 0;
    this.tokens = new Array();
    this._origin = origin;
    if (typeof(anzahl_getter) == 'number') {
        this._anzahl = anzahl_getter;
        this.getProfileNumber = function() {
            return this._anzahl;
        }
    } else {
        this.getProfileNumber = function() { return view.game.bars.getProfiles() };
        this._anzahl = this.getProfileNumber();
    }
    return this.__init__(view, token_map);
}

ProfileSet.prototype.__init__ = function(view, token_map) {
    var me = this;
    this.view = view;
    $.each(token_data, function(k, token_type) {
        var val_map = _.find(token_map, function(e) { return e.type == token_type.token_id })
        if (val_map == undefined) {
            var t = new TokenElement(view, token_type, 0);
        } else {
            var t = new TokenElement(view, token_type, val_map.amount);
        }
        me.tokens.push(t);
    });
}
ProfileSet.prototype.setupEvents = function() {
    var me = this;
    eve.on(this.event_base+'.start.'+me.elem.id, me.starthandler);
}
ProfileSet.prototype.start = function() {
    if (this.view.game.bars.getAP() < this.action_AP) return false;
    eve('bar.update.value', this.view.paper, 'ap_bar', -this.action_AP);
    return this;
}

ProfileSet.prototype.getOrigin = function() {
    return this._origin;
}

ProfileSet.prototype.getElements = function() {
    // Get non-zero tokens
    var result = new Array();
    $.each(this.tokens, function(k, t) {
        if (t.amount > 0) result.push(t);
    });
    return result;
}
ProfileSet.prototype.getTokenById = function(token_id) {
    // Get non-zero tokens
    var result=undefined;
    $.each(this.tokens, function(k, t) {
        if (t.token_id == token_id) result=t;
    });
    return result;
}

ProfileSet.prototype.getAllElements = function() {
    return this.tokens;
}

ProfileSet.prototype.render = function() {
    $.each(this.getElements(), function(k, t) { t.render(); t.makeBar(); });
}

ProfileSet.prototype.getValues = function() {
    var map = new Array();
    $.each(this.getElements(), function(k, v) {
        var elem = {};
        elem['type'] = v.token_id;
        elem['amount'] = v.amount;
        map.push(elem);
    });
    return map;
}

ProfileSet.prototype.getValuesMap = function() {
    var q = new Object();
    $.each(this.getValues(), function(k, v) {
        q[v.type] = v.amount;
    });
    return q;
}

ProfileSet.prototype.remove = function() { 
    this.view.game.main_view.database.queue.remove(this);
}

////////////////////////// DECORATION ELEMENT ///////////////////////////

function DecorationElement(view, settings) {
    // Decoration subelement
    this.className = 'DecorationElement';
    this.parent_item = settings.parent_item;
    if (settings.offset_x == undefined) settings.offset_x = 0;
    if (settings.offset_y == undefined) settings.offset_y = 0;
    if (settings.text == undefined) settings.text = '';
    this.offset_x = settings.offset_x;
    this.offset_y = settings.offset_y;
    this.type = settings.type;
    return this.__init__(view, settings);
}
extend(DecorationElement, BasicUIElement);

DecorationElement.prototype.render_decorator = function() {
    var parelem = this.parent_item.elem;
    var dec_r = parelem.paper.image(this.settings.sprite_img,
                                    parelem.attr('x') + this.offset_x,
                                    parelem.attr('y') + this.offset_y,
                                    this.settings.sprite_w,
                                    this.settings.sprite_h).hide_if_hidden(this.view.active);
    eve('mainview.new_element', dec_r);
    this.elem = dec_r;
    this.elem.item = this;
    return this;
}

DecorationElement.prototype.render_label = function() { 
    var parelem = this.parent_item.elem;
    var dec_r = parelem.paper.text(parelem.attr('x') + this.offset_x,
                                   parelem.attr('y') + this.offset_y,
                                   this.settings.text).attr(this.settings.text_attrs).hide_if_hidden(this.view.active);
    eve('mainview.new_element', dec_r);
    this.elem = dec_r;
    this.elem.item = this;
    return this;
}

DecorationElement.prototype.render_bar = function() {
    var parelem = this.parent_item.elem;
    var dec_r = parelem.paper.image(this.settings.sprite_img,
                                    parelem.attr('x') + this.offset_x,
                                    parelem.attr('y') + this.offset_y,
                                    this.settings.sprite_w,
                                    this.settings.sprite_h).hide_if_hidden(this.view.active);
    eve('mainview.new_element', dec_r);
    this.elem = dec_r;
    this.elem.item = this;
    this.update_bar();
    return this;
}

DecorationElement.prototype.update_bar = function() {
    var val = this.parent_item.amount;
    var paritem = this.parent_item;
    if (!val) {
        var val = 0;
    }
    if (this.type=='bar') {
        if (this.elem._bar) {
            this.elem._bar.remove();
        }
        var bg_coord = this.elem.getBBox();
        var coord = {}
        coord.x = bg_coord.x + this.settings.bar_offset_left;
        coord.y = bg_coord.y + this.settings.bar_offset_top;
        coord.width = Math.round(Math.min((val / 100), 1) * (bg_coord.width - this.settings.bar_offset_left - this.settings.bar_offset_right));
        coord.height = this.settings.bar_height;
        coord.r = this.settings.bar_radius;
        if (val<10) {
          var stats = ksNum(Math.round(paritem.view.game.profiles/100*val));
          this.elem._bar = this.view.paper.text(coord.x+41, coord.y+6,stats).attr(BAR_NUMBER_FONT).hide_if_hidden(this.view.active);
        } else {
          this.elem._bar = this.view.paper.rect(coord.x, coord.y, coord.width, coord.height, coord.r).attr({'fill': '270-#FF7E54:20-#E85E2B:70-#BC4C25','stroke':'#BC4C25','stroke-width':0.5}).hide_if_hidden(this.view.active);
        }
        eve('mainview.new_element', this.elem._bar);
    }
    return this;
}

////////////////////////// COMPLEX UI ELEMENT BASE CLASS ELEMENT ///////////////////////////

function GameElement(view, settings) {
    // 'main' element like DB, project, ... base class
    this.className = 'GameElement';
    this.x = settings.x;
    this.y = settings.y;
    this.ready = false;
    this.subelems = new Array();
    this.paper = view.paper;
    return this.__init__(view, settings);
}
extend(GameElement, BasicUIElement);

GameElement.prototype.getSet = function() {
    if (!this.elem) {
        // elem not rendered yet -- return empty set
        return this.view.paper.set();
    }
    var elem = this.elem;
    var s = elem.paper.set();
    s.push(elem);
    $.each(this.get('subelems'), function (k, v) {
        if (v.type=='bar') {
              s.push(v.parent_item.bar.elem._bar);
            }
        s.push(v.elem);
    });
    return s
}

GameElement.prototype.setupEvents = function() {
    // no-op
    return this;
}

GameElement.prototype.markReady = function() {
    if (this.ready) { return this; }
    var settings = this.getReadySettings();
    var dec = this.makeSubelem('ready', settings);
    this.ready = true;
    var dec_r = dec.render_decorator().elem;
    dec_r.bounce_on_create(dec.settings.sprite_h, dec_r.attr('y'));
    dec_r.hover_change_src(dec.settings.sprite_img_hover);
    this.elem.mouseupdown_change_src(this.settings.sprite_img,this.settings.sprite_img_down, this.settings.sprite_img_drag);
    dec_r.setup_click_ready(dec);
    return this;
}

GameElement.prototype.getReadySettings = function() {
    return _.clone(default_ready_decorator);
}


GameElement.prototype.markWorking = function() {
    var settings = this.getWorkingSettings();
    var me = this;
    var dec = this.makeSubelem('working', settings);
    var dec_r = dec.render_decorator().elem;
    dec_r.bounce_on_create(dec.settings.sprite_h, dec_r.attr('y'));
    var draw_cbar = function() {
        var perc = me.ready_in().rel;
        if (me.elem.paper && perc < 100) {
            dec_r.cbar(me, me.ready_in().rel, 16, 6, 0);
            setTimeout(draw_cbar, 150);
        }
    }
    draw_cbar();
    dec_r.hover_working(dec.settings.sprite_img_hover);
    return this;
}

GameElement.prototype.getWorkingSettings = function() {
    return _.clone(default_working_decorator);
}

GameElement.prototype.unmarkWorking = function() {
    var me = this;
    var working_only = function(dec) {
        if (dec.type=='working') {
            return true;
        }
        return false;
    }
    $.each(_.filter(this.subelems, working_only), function (k, v) {
        var dec_r = v.elem;
        var dec = v;
        dec_r.bounce_on_destroy(dec.settings.sprite_h, dec_r.attr('y'), dec.offset_y, function(){ me.destroySubelem(v); });
    });
    if (me.elem._cbar) {
        me.elem._cbar.remove();
        delete me.elem._cbar;
    }
    this.working = false;
    return this;
}

GameElement.prototype.getLabelSettings = function() {
    var s = _.clone(default_ready_decorator);
    s.offset_x = Math.floor(this.elem.attr('width')/2);
    s.offset_y = this.elem.attr('height') + 6;
    s.text = this.settings.label;
    s.text_attrs = this.settings.font_attr;
    return s;
}

GameElement.prototype.unmarkReady = function() {
    var elem = this.elem;
    var view = this.view;
    var item = this;
    eve('bar.update.value', view.paper, 'xp_bar', 2);
    eve('bar.update.value', view.paper, 'ap_bar', -1);
    var origin = item;
    var profileset = origin.action();
    origin.view.database.queue.add(profileset);
    eve('bar.update.value', view.paper, 'image_bar', item.getTotalRisk());
    var me = this;
    var ready_only = function(dec) {
        if (dec.type=='ready') {
            return true;
        }
        return false;
    }
    $.each(_.filter(this.subelems, ready_only), function (k, v) {
        var dec_r = v.elem;
        var dec = v;
        dec_r.let_em_fly(me);
        dec_r.bounce_on_destroy(dec.settings.sprite_h, dec_r.attr('y'), dec.offset_y, function(){ me.destroySubelem(v); });
    });
    this.ready = false;
    return this;
}

GameElement.prototype.renderLabel = function() {
    var settings = this.getLabelSettings();
    var dec = this.makeSubelem('label', settings);
    dec.render_label();
    return this;
}

GameElement.prototype.makeSubelem = function(type, settings) {
    settings.parent_item = this;
    settings.type = type;
    var dec = new DecorationElement(this.view, settings);
    this.subelems.push(dec);
    return dec;
}

GameElement.prototype.destroySubelem = function(dec) {
    this.subelems = _.without(this.subelems, dec);
    dec.remove();
    return this;
}

GameElement.prototype.hide = function() {
    this.getSet().hide();
    return this;
}

GameElement.prototype.show = function() {
    this.getSet().show();
    return this;
}

GameElement.prototype.render = function() {
    this.elem = this.view.paper.image(this.settings.sprite_img, this.x, this.y, this.settings.sprite_w, this.settings.sprite_h).hide_if_hidden(this.view.active);
    eve('mainview.new_element', this.elem);
    this.elem.item = this;
    this.setupEvents();
    this.elem.mouseup(this.clickhandler);
    this.elem.hover_change_src(this.settings.sprite_img_hover);
    this.elem.mouseupdown_change_src(this.settings.sprite_img,this.settings.sprite_img_down, this.settings.sprite_img_drag);
    this.elem.make_draggable();
    this.renderLabel();
    return this;
}

GameElement.prototype.clickhandler = function() { if (!this.dragged && !this.paper._panner.dragged) { this.item.markReady(); } }


////////////////////////// PROJECT ELEMENT /////////////////////////////

function ProjectElement(view, settings) {
    this.className = 'ProjectElement';
    this.x = settings.x;
    this.y = settings.y;
    this.ready = false;
    this.subelems = new Array();
    this.paper = view.paper;
    this.action_cost = settings.action_cost;
    this.action_time = settings.action_time;
    this.working = false;
    this.working_ready = false;
    this.event_base = 'project';
    this.upgrades = settings.upgrades;
    this.actions = settings.actions;
    this.team = settings.team;
    this.tokens = settings.tokens;
    view._projects.push(this);
    return this.__init__(view, settings); 
}
extend(ProjectElement, GameElement);
ProjectElement.prototype.setupEvents = function() {
    var me = this;
    eve.on(this.event_base+'.start.'+me.elem.id, me.starthandler);
    eve.on(this.event_base+'.ready.'+me.elem.id, me.readyhandler);
}
ProjectElement.prototype.tickhandler = function() {
    if (!this.working && !this.elem.dragged && !this.ready && !this.elem._hover) {
        if (this.elem.transform().toString() == '') {
            if (Math.random() > 0.5) {
                this.elem.anim_shiver();
            }
        }
    }
}
ProjectElement.prototype.getUpgrade = function(id) {
    var u=undefined;
    $.each([this.upgrades,this.actions,this.team],function(k,v){
      $.each(v,function(kk,vv){
          if (vv.id==id) {
              u= vv;
          }
      });
    });
    return u;
}
ProjectElement.prototype.buyUpgrade = function(id) {
    var me = this;
    $.each([this.upgrades,this.actions,this.team],function(k,v){
      $.each(v,function(k,v){
          if (v.id==id) { 
              v.bought=true;
              eve('bar.update.value', me.paper, 'money_bar', -v.action_cost);
              eve('bar.update.value', me.paper, 'xp_bar', 1);
          }
      });
    });
    return this;
}

ProjectElement.prototype.clickhandler = function() { if (!this.dragged && !this.paper._panner.dragged) { project_popup(this.item); } }
ProjectElement.prototype.starthandler = function() {
    // 'aufladen'/starten-aktion
    if (this.view.game.money < this.getCosts() || this.ready == true || this.working == true) return this;
    eve('bar.update.value', this.paper, 'money_bar', -this.getCosts());
    eve('bar.update.value', this.paper, 'xp_bar', 1);
    var time = new Date();
    var me = this;
    this.working_start = time.getTime();
    this.working_ready = this.working_start + this.action_time;
    this.working = true;
    this.markWorking();
    var eves = this.event_base+'.ready.'+this.elem.id;
    var readyfoo = function() {
        eve(eves, me);
    }
    window.setTimeout(readyfoo, this.action_time);
    return this;
}

ProjectElement.prototype.readyhandler = function() {
    this.working = false;
    this.working_ready = 0;
    this.markReady();
    this.unmarkWorking();
    return this;
}
ProjectElement.prototype.start = function() {
    if (this.elem) eve(this.event_base+'.start.'+this.elem.id, this); 
    return this;
}
ProjectElement.prototype.ready_in = function() {
    if (!this.working) {
        return {abs:0, rel: 100};
    }
    var time = new Date();
    return {abs: this.working_ready - time.getTime(),
            rel: Math.round(100*(time.getTime() - this.working_start)/(this.working_ready - this.working_start))};
}

ProjectElement.prototype.action = function() {
    var token_map = new Array();
    // random +/- 5% profilecount in profileset 
    var amount_b = this.getAmount();
    var variation = Math.random()*10-5;
    var amount = amount_b + Math.round((amount_b/100)*variation);
    this.elem.profile_bling(this,amount);
    $.each(this.getTokens(), function(k, v) {
        token_map.push({'type': v, 'amount': 100});
    });
    return new ProfileSet(this.view, token_map, amount, this);
}

ProjectElement.prototype.getAmount = function() {
    return this.settings.base_amount + this.getUpgradeAmount();
}

ProjectElement.prototype.activeUpgrades = function() {
    var up = new Array();
    if (this.team) up = up.concat(this.team);
    if (this.upgrades) up = up.concat(this.upgrades);
    if (this.actions) up = up.concat(this.actions);
    return _.filter(up, function(elem) { return elem.bought == true; });
}

ProjectElement.prototype.getTokens = function() {
    return _.reduce(this.activeUpgrades(), function(m, elem) { 
        if (elem.bonus_token) return _.union(m, elem.bonus_token);
        return m;
        }, this.tokens);
   
}
ProjectElement.prototype.getUpgradeAmount = function() {
    return _.reduce(this.activeUpgrades(), function(m, elem) { 
        if (elem.bonus_profiles) return m + elem.bonus_profiles;
        return m;
        }, 0);
}

ProjectElement.prototype.getUpgradeRisk = function() {
    return _.reduce(this.activeUpgrades(), function(m, elem) { 
        if (elem.bonus_risk) return m + elem.bonus_risk;
        return m;
        }, 0);
}

ProjectElement.prototype.getTotalRisk = function() {
    return this.settings.base_risk + this.getUpgradeRisk();
}

ProjectElement.prototype.getCosts = function() {
    return _.reduce(this.activeUpgrades(), function(m, elem) { 
        if (elem.bonus_cost) return m + elem.bonus_cost;
        return m;
        }, this.action_cost);
}


////////////////////////// DATABASE TOKEN  /////////////////////////////

function TokenElement(view, settings, amount) {
    this.className = 'TokenElement';
    this.x = settings.x;
    this.y = settings.y;
    this.token_id = settings.token_id;
    this.match = settings.match;
    this.matching = false;
    this.offset_x = 111;
    this.subelems = new Array();
    this.amount = amount;
    this.paper = view.paper;
    return this.__init__(view, settings);
}
extend(TokenElement, GameElement);

TokenElement.prototype.clickhandler = function() { 
  if (!this.dragged && !this.paper._panner.dragged) token_info_popup(this.item.token_id,this.item);
}

TokenElement.prototype.getLabelSettings = function() {
    var s = {};
    s.offset_x = 3+Math.floor(this.elem.attr('width')/2);
    s.offset_y = this.elem.attr('height') +10;
    s.text = this.settings.label;
    s.text_attrs = DB_LABEL_FONT;
    return s;
}

TokenElement.prototype.makeBar = function() {
    var settings = bar_decorator;
    var me = this;
    var dec = this.makeSubelem('bar', settings);
    var dec_r = dec.render_bar().elem;
    this.bar = dec;
    return this;
}
TokenElement.prototype.update_bar = function() {
    this.bar.update_bar();
    return this;
}

////////////////////////// DATABASE ELEMENT /////////////////////////////

function DBElement(view, settings) {
    // Database item
    this.className = 'DBElement';
    this.x = settings.x;
    this.y = settings.y;
    this.subelems = new Array();
    this.paper = view.paper;
    return this.__init__(view, settings);
}
extend(DBElement, GameElement);
DBElement.prototype.clickhandler = function() { 
    if (!this.dragged && !this.paper._panner.dragged) {
        var g=this.item.view.game;
        var temp_switch = function(){
            g.switch_db();
        }
        setTimeout(temp_switch,100);
    } 
}

DBElement.prototype.markProfilesWaiting = function() {
    var settings = _.clone(db_decorator);
    var me = this;
    settings.offset_x = settings.offset_x+(Math.random()*16)
    settings.offset_y = settings.offset_y+(Math.random()*16)
    var dec = this.makeSubelem('db_marker', settings);
    var dec_r = dec.render_decorator().elem;
    dec_r.bounce_on_create(dec.settings.sprite_h, dec_r.attr('y'));
    return this;
}

DBElement.prototype.unmarkProfilesWaiting = function() {
  var db_marker_only = function(dec) {
        if (dec.type=='db_marker') {
            return true;
        }
        return false;
    }
  var me= this;
  $.each(_.filter(this.subelems, db_marker_only), function (k, v) {
        var dec_r = v.elem;
        var dec = v;
        dec_r.bounce_on_destroy(dec.settings.sprite_h, dec_r.attr('y'), dec.offset_y, function(){ me.destroySubelem(v); });
        return false;
  });
}



////////////////////////// AGENT ELEMENT /////////////////////////////
function AgentElement(view, settings) {
    // Agent item
    this.className = 'AgentElement';
    this.x = settings.x;
    this.y = settings.y;
    this.ready = false;
    this.subelems = new Array();
    this.paper = view.paper;
    view._agents.push(this);
    return this.__init__(view, settings);
}
extend(AgentElement, GameElement);
AgentElement.prototype.clickhandler = function() { if (!this.dragged && !this.paper._panner.dragged) { agent_popup(this.item); } }

////////////////////////// CONTACT ELEMENT /////////////////////////////
function ContactElement(view, settings, agent) {
    // Contact item
    this.className = 'ContactElement';
    this.x = settings.x;
    this.y = settings.y;
    this.ready = false;
    this.subelems = new Array();
    this.paper = view.paper;
    this.action_cost = settings.action_cost;
    this.action_time = settings.action_time;
    this.working = false;
    this.working_ready = false;
    this.event_base = 'contact';
    this.agent = agent;
    this.tokens = settings.tokens;
    view._contacts.push(this);
    return this.__init__(view, settings);
}
extend(ContactElement, GameElement);
ContactElement.prototype.getReadySettings = function() {
    var s = _.clone(default_ready_decorator);
    s.offset_x = 14;
    return s;
}
ContactElement.prototype.getWorkingSettings = function() {
    var s = _.clone(default_working_decorator);
    s.offset_x = 80;
    s.offset_y = 0;
    return s;
}

ContactElement.prototype.connectToAgent = function() {
    if (this.elem && this.agent) {
        if (this.agent.elem) this.elem.connect_to(this.agent.elem); 
    }
    return this;
}
ContactElement.prototype.tickhandler = function() {
    if (!this.working && !this.elem.dragged && !this.ready && !this.elem._hover) {
        if (this.elem.transform().toString() == '') {
            if (Math.random() > 0.5) {
                this.elem.anim_shiver();
            }
        }
    }
}
ContactElement.prototype.clickhandler = function() { if (!this.dragged && !this.paper._panner.dragged) { contact_popup(this.item); } }
ContactElement.prototype.setupEvents = ProjectElement.prototype.setupEvents;
ContactElement.prototype.starthandler = ProjectElement.prototype.starthandler;
ContactElement.prototype.readyhandler = ProjectElement.prototype.readyhandler;
ContactElement.prototype.start = ProjectElement.prototype.start;
ContactElement.prototype.ready_in = ProjectElement.prototype.ready_in;
ContactElement.prototype.action = ProjectElement.prototype.action;
ContactElement.prototype.getAmount = ProjectElement.prototype.getAmount;
ContactElement.prototype.activeUpgrades = ProjectElement.prototype.activeUpgrades;
ContactElement.prototype.getTokens = function() { return this.tokens; }
ContactElement.prototype.getUpgradeAmount = function() { return 0; }
ContactElement.prototype.getUpgradeRisk = function() { return 0; }
ContactElement.prototype.getTotalRisk = function() { return this.settings.base_risk; }
ContactElement.prototype.getCosts = function() { return this.action_cost; }

////////////////////////// CUSTOMER ELEMENT /////////////////////////////
function CustomerElement(view, settings) {
    // Customer Element
    this.className = 'CustomerElement';
    this.x = settings.x;
    this.y = settings.y;
    this.paper = view.paper;
    this.ready = false;
    this.working = false;
    this.working_ready = false;
    this.subelems = new Array();
    this.event_base = 'customer';
    this.action_AP = settings.action_AP;
    this.action_time = settings.action_time;
    this.action_income = settings.action_income;
    view._customers.push(this);
    return this.__init__(view, settings);
}
extend(CustomerElement, GameElement);

CustomerElement.prototype.getReadySettings = function() {
    var s = _.clone(customer_ready_decorator);
    s.offset_x = 18;
    return s;
}
CustomerElement.prototype.getWorkingSettings = function() {
    var s = _.clone(default_working_decorator);
    s.offset_x = 93;
    s.offset_y = 2;
    return s;
}


CustomerElement.prototype.getLabelSettings = function() {
    var s = _.clone(customer_ready_decorator);
    s.offset_x = Math.floor(this.elem.attr('width')/2);
    s.offset_y = this.elem.attr('height') + 8;
    s.text = this.settings.label;
    s.text_attrs = this.settings.font_attr;
    return s;
}
CustomerElement.prototype.setupEvents = function() {
    var me = this;
    eve.on(this.event_base+'.start.'+me.elem.id, me.starthandler);
    eve.on(this.event_base+'.ready.'+me.elem.id, me.readyhandler);
}

CustomerElement.prototype.starthandler = function() {
    // 'deal starten'-aktion
    if (this.view.game.bars.getAP() < this.action_AP || this.ready == true || this.working == true) return this;
    eve('bar.update.value', this.paper, 'ap_bar', -this.action_AP);
    eve('bar.update.value', this.paper, 'xp_bar', 1);
    var time = new Date();
    var me = this;
    this.working_start = time.getTime();
    this.working_ready = this.working_start + this.action_time;
    this.working = true;
    this.markWorking();
    var eves = this.event_base+'.ready.'+this.elem.id;
    var readyfoo = function() {
        eve(eves, me);
    }
    window.setTimeout(readyfoo, this.action_time);
    return this;
}
CustomerElement.prototype.readyhandler = function() {
    this.working = false;
    this.working_ready = 0;
    this.markReady();
    this.unmarkWorking();
    return this;
}
CustomerElement.prototype.start = function() {
    // fire an event
    if (this.elem) eve(this.event_base+'.start.'+this.elem.id, this); 
    return this;
}
CustomerElement.prototype.ready_in = function() {
    if (!this.working) {
        return {abs:0, rel: 100};
    }
    var time = new Date();
    return {abs: this.working_ready - time.getTime(),
            rel: Math.round(100*(time.getTime() - this.working_start)/(this.working_ready - this.working_start))};
}


CustomerElement.prototype.clickhandler = function() { if (!this.dragged && !this.paper._panner.dragged) { customer_popup(this.item); } }

CustomerElement.prototype.unmarkReady = function() {
    var elem = this.elem;
    var view = this.view;
    var item = this;
    eve('bar.update.value', view.paper, 'xp_bar', 2);
    eve('bar.update.value', view.paper, 'ap_bar', -1);
    // CUSTOMER CASH
    var income = item.getIncome();
    setTimeout(function(){
      eve('bar.update.value', view.paper, 'money_bar', income );
    },1000);
    var me = this;
    var ready_only = function(dec) {
        if (dec.type=='ready') {
            return true;
        }
        return false;
    }
    $.each(_.filter(this.subelems, ready_only), function (k, v) {
        var dec_r = v.elem;
        var dec = v;
        dec_r.money_bling(me,me.action_income);
        dec_r.bounce_on_destroy(dec.settings.sprite_h, dec_r.attr('y'), dec.offset_y, function(){ me.destroySubelem(v); });
    });
    this.ready = false;
    return this;
}

CustomerElement.prototype.tickhandler = function() {
    if (this.view.active) {
        if (!this.working && !this.elem.dragged && !this.ready && !this.elem._hover) {
                var elem=this;
                if (Math.random() > 0.5) {
                    this.elem.anim_shiver();
                }
        }
        if (this.working && !this.elem.dragged) {
                this.elem.pulsate_conn_paths(this,true);
                if (Math.random() > 0.5) {
                  this.elem.let_em_fly(this,true);
                }
        }
    }
}

CustomerElement.prototype.getIncome = function(){
  var customer=this;
  var s=customer.settings;
  var t_in = new Array();
  var t_out = new Array();
  var db_profiles=customer.view.game.db_view.profiles;
  var db_max=customer.view.game.bars.bars.profile_bar.maximum;
  $.each(s.tokens_in,function(k,v){
      t_in.push(db_profiles.getTokenById(v).amount/100);
  });
  $.each(s.tokens_out,function(k,v){
      t_out.push(db_profiles.getTokenById(v).amount/100);
  });
  var amount=0;
  $.each(t_out,function(k,tout){
      var subamount = tout;
      $.each(t_in,function(k,tin){
          subamount=subamount*tin;
      });
      amount=amount+subamount;
  });
  amount = amount*(db_profiles.getProfileNumber()/db_max);
  amount = Math.round((s.base_income+amount*(s.base_income)*s.base_income_factor)/10)*10;
  customer.action_income=amount;
  return amount;

}

