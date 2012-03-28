/* ################### STATUSBAR stuff ######################## */

/* BarElement base class */

function BarElement(view, settings) {
    return this.__init__(view, settings);
}

BarElement.prototype.__init__ = function(view, settings) {
    this.id = settings.id;
    this.view = view;
    this.settings = settings;
    this.value = settings.init_val;
    this.maximum = settings.max_val;
    this.bg_coord = this.getBgCoord();
    this.deco_coord = this.getDecoCoord();
    return this;
}

BarElement.prototype.render = function() {
    this.destroyElements();
    var me = this;
    var bg_coord = this.getBgCoord();
    var deco_coord = this.getDecoCoord();
    var prog_coord = this.getProgCoord();
    var prog_attr = this.settings.prog_attr;
    var prog_attr_active = this.settings.prog_attr_active;
    this.bar_bg = this.view.paper.image(this.settings.bar_image, bg_coord.x, bg_coord.y, bg_coord.w, bg_coord.h);
    this.bar_prog = this.view.paper.rect(prog_coord.x, prog_coord.y, prog_coord.w, prog_coord.h, prog_coord.r).attr(prog_attr);
    this.bar_deco = this.view.paper.image(this.settings.deco_image, deco_coord.x, deco_coord.y, deco_coord.w, deco_coord.h);

    var center = this.bar_bg.center_of_image();
    this.bar_text = this.view.paper.text(center.x + this.settings.text_offset_x, center.y-1, '').attr(this.settings.font_attr).attr({text: this.getLabelText()});

    this.bar_deco.hover(function(){ me.bounce(); }, function(){});
    this.bar_deco.click(function(){
        statusbar_popup(me);
    });
    this.bar_text.click(function(){
        statusbar_popup(me);
    });
    this.bar_bg.click(function(){
        statusbar_popup(me);
    });
    this.bar_prog.click(function(){
        statusbar_popup(me);
    });
    $.each(this.relements(), function(k,v) { me.view.pin_element(v); });
    this.bounce();
    this.bar_prog.animate(prog_attr_active,100, function(){
      this.animate(prog_attr,600);
    });
}

BarElement.prototype.getLabelText = function() {
    return this.kiloSepNumber(this.value);
}

BarElement.prototype.kiloSepNumber = function(num) {
    return kiloSepNumber(num);
}

BarElement.prototype.relements = function() {
    return new Array(this.bar_bg, this.bar_prog, this.bar_deco, this.bar_text);
}

BarElement.prototype.destroyElements = function() {
    var elements = this.relements();
    var me = this;
    $.each(elements, function(k, v) {
        me.view.unpin_element(v);
        if (v) {
            if (!v.removed) {
                v.remove();
            }
        }
    });
}

BarElement.prototype.getBgCoord = function() {
    return this.settings.bar_dim;
}

BarElement.prototype.getDecoCoord = function() {
    return this.settings.deco_dim;
}

BarElement.prototype.getProgCoord = function () {
    var bg_coord = this.getBgCoord();
    var coord = {};
    var left_offset = 4;
    var top_offset = 6;
    var right_offset = 9;
    var radius = 4;
    coord.x = bg_coord.x + left_offset;
    coord.y = bg_coord.y + top_offset;
    coord.w = Math.round(Math.min((this.getPercentage() / 100), 1) * (bg_coord.w - left_offset - right_offset));
    coord.h = 20;
    coord.r = radius;
    return coord;
}

BarElement.prototype.getSet = function() {
    var set = this.view.paper.set();
    var elements = this.relements();
    $.each(this.relements(), function(k,v) { set.push(v); });
    return set;
}

BarElement.prototype.getDecoSet = function() {
    var set = this.view.paper.set();
    set.push(this.bar_deco);
    return set;
}

BarElement.prototype.BBox = function() {
    return this.getSet().getBBox();
}

BarElement.prototype.centerOf = function() {
    var box = this.BBox();
    return {x: Math.floor(box.x + (box.width/2)),
            y: Math.floor(box.y + (box.height/2))};
}

BarElement.prototype.bounce = function() {
    var c = this.centerOf();
    var s = this.getDecoSet();
    var elem = this;
    var extra = 't'+elem.view.paper._viewBox[0]+ ',' + elem.view.paper._viewBox[1];
    s.animate({'transform': extra + 'S1.2,1.2'}, 100, 'elastic', function () { s.animate({'transform': extra + 'S1,1'}, 300, '>'); });
}

BarElement.prototype.set_value = function(newval) {
    if (this.value != newval) {
        this.value = newval;
        this.render();
    }
}

BarElement.prototype.update_value = function(inc) {
    this.set_value(this.value + inc);
}

BarElement.prototype.getPercentage = function() {
    return Math.round((this.value / this.maximum) * 100);
}

/* Specific subclasses */


function MoneyBar(view, settings) {
    return this.__init__(view, settings);
}

extend(MoneyBar, BarElement);

MoneyBar.prototype.getPercentage = function() {
    return 100;
}


function APBar(view, settings) {
    this.getLabelText = function() { return this.value+'/'+this.maximum; }
    this.set_value = function(newval) {
        if (newval <= this.maximum) {
            this.value = newval;
            this.render();
        } else {
            if (this.value < this.maximum) {
                this.value = this.maximum;
                this.render();
            }
        }
    }
    return this.__init__(view, settings);
}
extend(APBar, BarElement);

APBar.prototype.maximize = function() {
    this.set_value(this.maximum);
}

function ImageBar(view, settings) {
    this.getLabelText = function() { return this.getPercentage(); }
    return this.__init__(view, settings);
}
extend(ImageBar, BarElement);

ImageBar.prototype.set_value = function(newval) {
    if (newval > this.maximum) newval = this.maximum;
    if (newval < 0) newval = 0;
    if (this.value != newval) {
        this.value = newval;
        this.render();
    }
    this.check_value();
}

ImageBar.prototype.check_value = function() {
    if (this.value > 49) {
        var r = 40 + (Math.random() * 80); // 40 - 120
        if (r < this.value) {
            var curmoney = this.view.paper._bars.bars['money_bar'].value;
            if (curmoney>100) {
                var amount = Math.min(Math.round(curmoney/2), 1200);
                eve('mainview.risk.warning', this.view, amount);
            }
        }
    }
}

function XPBar(view, settings) {
    var level_bound = _.find(settings.levels, function (l) { 
            if (settings.init_val >= l[0] && settings.init_val <= l[1]) {
                return true;
            } else {
                return false;
            }
        });
    this.level = _.indexOf(settings.levels, level_bound);
    settings.max_val = level_bound[1];
    settings.min_val = level_bound[0];
    this.getPercentage = function() { return Math.round(((this.value - this.settings.min_val)/(this.maximum - this.settings.min_val)) * 100); }
    this.set_value = function(newval) {
        if (newval > this.maximum) {
            this.level = this.level + 1;
            var l = this.settings.levels[this.level];
            this.maximum = l[1];
            this.settings.max_val = l[1];
            this.settings.min_val = l[0];
            eve('mainview.levelup', this.view, this.level);
        }
        this.value = newval;
        this.render();
    }
    this.getDecoSet = function() {
        var set = this.view.paper.set();
        set.push(this.bar_deco);
        set.push(this.deco_text);
        return set;
    }
    this.render = function() {
        this.destroyElements();
        var me = this;
        var bg_coord = this.getBgCoord();
        var deco_coord = this.getDecoCoord();
        var prog_coord = this.getProgCoord();
        var prog_attr = this.settings.prog_attr;
        var prog_attr_active = this.settings.prog_attr_active;
        this.bar_bg = this.view.paper.image(this.settings.bar_image, bg_coord.x, bg_coord.y, bg_coord.w, bg_coord.h);
        this.bar_prog = this.view.paper.rect(prog_coord.x, prog_coord.y, prog_coord.w, prog_coord.h, prog_coord.r).attr(prog_attr);
        this.bar_deco = this.view.paper.image(this.settings.deco_image, deco_coord.x, deco_coord.y, deco_coord.w, deco_coord.h);
        var center = this.bar_bg.center_of_image();
        this.bar_text = this.view.paper.text(center.x + this.settings.text_offset_x, center.y-1, '').attr(this.settings.font_attr).attr({text: this.getLabelText()});
        var c_deco = this.bar_deco.center_of_image();
        this.deco_text = this.view.paper.text(c_deco.x-3, c_deco.y-1, '').attr(this.settings.font_attr).attr({text: this.level,'fill':'#666','stroke-width':0});
        $.each(this.relements(), function(k,v) { me.view.pin_element(v); });
        this.bounce();
        this.bar_prog.animate(prog_attr_active,100, function(){
           this.animate(prog_attr,600);
        });

        this.bar_text.click(function(){
          statusbar_popup(me);
        });
        this.bar_bg.click(function(){
          statusbar_popup(me);
        });
        this.bar_prog.click(function(){
          statusbar_popup(me);
        });
        this.getDecoSet().click(function(){
          statusbar_popup(me);
        });
    }
    this.relements = function() {
        return new Array(this.bar_bg, this.bar_prog, this.bar_deco, this.bar_text, this.deco_text);
    }
    return this.__init__(view, settings);
}
extend(XPBar, BarElement);

function StatusBar(view) {
    return this.__init__(view);
}

StatusBar.prototype.__init__ = function(view) {
    settings_all = _.values(STATUS_BARS);
    this.view = view;
    this.bars = new Array();

    var me = this;

    $.each(settings_all, function (k, v) {
            switch (v.id) {
                case 'money_bar':
                    var bar = new MoneyBar(me.view, v);
                    break;
                case 'ap_bar':
                    var bar = new APBar(me.view, v);
                    break;
                case 'image_bar':
                    var bar = new ImageBar(me.view, v);
                    break;
                case 'xp_bar':
                    var bar = new XPBar(me.view, v);
                    break;
                default:
                    var bar = new BarElement(me.view, v);
                    break;
            }
            me.bars[v.id] = (bar);
            bar.render();
    });
    eve.on('bar.update.value', update_bar_value);
    eve.on('mainview.levelup', full_ap);
    eve.on('mainview.levelup', levelup);
    eve.on('mainview.risk.warning', protests);
    return me;
}

StatusBar.prototype.startAPTimer = function() {
    var paper = this.view.paper;
    var me = this;
    var inc_ap = function () {
        eve('bar.update.value', paper, 'ap_bar', 1);
        setTimeout(inc_ap, 10000);
    }
    inc_ap();
    return me;
}

StatusBar.prototype.getProfiles = function() {
    return this.bars['profile_bar'].value;
}

StatusBar.prototype.setProfiles = function(val) {
    return this.bars['profile_bar'].set_value(val);
}

StatusBar.prototype.getAP = function() {
    return this.bars['ap_bar'].value;
}

StatusBar.prototype.setAP = function(val) {
    return this.bars['ap_bar'].set_value(val);
}

StatusBar.prototype.getXP = function() {
    return this.bars['xp_bar'].value;
}

StatusBar.prototype.setXP = function(val) {
    return this.bars['xp_bar'].set_value(val);
}

StatusBar.prototype.getLevel = function() {
    return this.bars['xp_bar'].level;
}

StatusBar.prototype.getMoney = function() {
    return this.bars['money_bar'].value;
}

StatusBar.prototype.setMoney = function(val) {
    return this.bars['money_bar'].set_value(val);
}
